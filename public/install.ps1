# Installs the redvars CLI on Windows, from PowerShell:
#
#   irm https://redvars.com/install.ps1 | iex
#   & ([scriptblock]::Create((irm https://redvars.com/install.ps1))) preview    # or a version, such as 0.3.0
#
# Reads the version and the executable's SHA-256 from the store (v1/cli/<stable|preview|version>.txt
# on https://store.redvars.com), downloads the executable from the store's GitHub release, checks the
# digest, puts it in %USERPROFILE%\.local\bin, or in %ProgramFiles%\redvars from an elevated prompt
# so that services can run it, and adds that folder to the user's (or the machine's) Path.
# `redvars upgrade` updates it and `redvars uninstall` removes it.
#
# PLATFORM_STORE_URL and PLATFORM_RELEASES_URL point it at a mirror of the store and its releases.

param(
  [Parameter(Position = 0)]
  [string]$Target = "stable"
)

# A script block, so nothing is left defined in the session that ran `iex`, and no `exit`, which
# would close it.
& {
  param([string]$Target)
  $ErrorActionPreference = "Stop"
  $ProgressPreference = "SilentlyContinue"
  $VersionPattern = '^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$'

  function Fail([string]$Message) { throw "install.ps1: $Message" }

  function Get-Text([string]$Url) {
    $content = (Invoke-WebRequest -UseBasicParsing -Uri $Url).Content
    if ($content -is [byte[]]) { return [Text.Encoding]::UTF8.GetString($content) }
    return $content
  }

  # Tells Explorer the Path changed, so terminals opened from now on see it.
  function Publish-Environment {
    if (-not ("Win32.InstallNativeMethods" -as [type])) {
      Add-Type -Namespace Win32 -Name InstallNativeMethods -MemberDefinition @"
[DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
public static extern IntPtr SendMessageTimeout(IntPtr hWnd, uint Msg, UIntPtr wParam, string lParam, uint fuFlags, uint uTimeout, out UIntPtr lpdwResult);
"@
    }
    $result = [UIntPtr]::Zero
    [void][Win32.InstallNativeMethods]::SendMessageTimeout([IntPtr]0xffff, 0x1A, [UIntPtr]::Zero, "Environment", 2, 5000, [ref]$result)
  }

  try {
    if ($Target -ne "stable" -and $Target -ne "preview" -and $Target -notmatch $VersionPattern) {
      Fail "the version is stable, preview or a version such as 0.3.0, not `"$Target`""
    }
    $store = if ($env:PLATFORM_STORE_URL) { $env:PLATFORM_STORE_URL } else { "https://store.redvars.com" }
    $releases = if ($env:PLATFORM_RELEASES_URL) { $env:PLATFORM_RELEASES_URL } else { "https://github.com/redvars/store/releases/download" }
    # Windows PowerShell 5.1 may offer only TLS 1.0, which GitHub refuses.
    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

    # An x64 PowerShell on an Arm PC reports AMD64 in PROCESSOR_ARCHITECTURE and the machine's in
    # PROCESSOR_ARCHITEW6432. Windows on Arm runs the x64 executable when there is no arm64 one.
    $machine = if ($env:PROCESSOR_ARCHITEW6432) { $env:PROCESSOR_ARCHITEW6432 } else { $env:PROCESSOR_ARCHITECTURE }
    $systems = switch ($machine) {
      "AMD64" { @("windows-x64") }
      "ARM64" { @("windows-arm64", "windows-x64") }
      default { Fail "redvars runs on x64 and arm64 Windows, not $machine" }
    }

    $index = try { Get-Text "$store/v1/cli/$Target.txt" } catch { $null }
    if (-not $index) {
      if ($Target -eq "stable") {
        Fail "the store has no stable release of the CLI yet; for the newest preview: & ([scriptblock]::Create((irm https://redvars.com/install.ps1))) preview"
      }
      Fail "the store has no CLI release `"$Target`" ($store/v1/cli/$Target.txt)"
    }
    $lines = @($index -split "`r?`n" | Where-Object { $_ })
    $version = $lines[0]
    if ($version -notmatch $VersionPattern) { Fail "the store's list for $Target is not one this installer reads" }
    $entry = $null
    foreach ($system in $systems) {
      $entry = $lines | Select-Object -Skip 1 | ForEach-Object { , ($_ -split " ") } | Where-Object { $_[0] -eq $system } | Select-Object -First 1
      if ($entry) { break }
    }
    if (-not $entry) { Fail "redvars $version has no executable for $($systems[0])" }
    $digest, $file = $entry[1], $entry[2]
    if ($digest -notmatch '^[0-9a-f]{64}$' -or $file -notmatch '^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$') {
      Fail "the store's list for $Target is not one this installer reads"
    }

    $identity = [Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
    if ($identity.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
      $dir = Join-Path $env:ProgramFiles "redvars"
      $scope = "Machine"
    } else {
      $dir = Join-Path $env:USERPROFILE ".local\bin"
      $scope = "User"
    }
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    $exe = Join-Path $dir "redvars.exe"

    # Downloaded into the install folder, so the last steps are renames, even over a running redvars.exe.
    $download = Join-Path $dir ".redvars-$version.download.exe"
    try {
      Write-Host "Downloading redvars $version for $($entry[0])"
      try { Invoke-WebRequest -UseBasicParsing -Uri "$releases/$file" -OutFile $download }
      catch { Fail "could not download $releases/$file ($($_.Exception.Message))" }
      $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $download).Hash.ToLowerInvariant()
      if ($actual -ne $digest) { Fail "the download's SHA-256 is $actual, not $digest as the store lists it; nothing was installed" }
      $runs = try { $null = & $download --version; $LASTEXITCODE -eq 0 } catch { $false }
      if (-not $runs) { Fail "redvars $version does not run on this system; nothing was installed" }

      # A running executable cannot be replaced, but it can be renamed; the old copy goes when it can.
      if (Test-Path -LiteralPath $exe) {
        $old = "$exe.old"
        Remove-Item -LiteralPath $old -Force -ErrorAction SilentlyContinue
        if (Test-Path -LiteralPath $old) { $old = "$exe.$([guid]::NewGuid().ToString('N')).old" }
        Move-Item -LiteralPath $exe -Destination $old -Force
        Remove-Item -LiteralPath $old -Force -ErrorAction SilentlyContinue
      }
      Move-Item -LiteralPath $download -Destination $exe -Force
    } finally {
      Remove-Item -LiteralPath $download -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Installed redvars $version at $exe"

    # The Path is read and written unexpanded, so entries such as %USERPROFILE%\... stay as they are.
    $key = if ($scope -eq "User") {
      [Microsoft.Win32.Registry]::CurrentUser.OpenSubKey("Environment", $true)
    } else {
      [Microsoft.Win32.Registry]::LocalMachine.OpenSubKey("SYSTEM\CurrentControlSet\Control\Session Manager\Environment", $true)
    }
    try {
      $entries = @(([string]$key.GetValue("Path", "", "DoNotExpandEnvironmentNames")) -split ";" | Where-Object { $_ })
      $listed = $entries | Where-Object { [Environment]::ExpandEnvironmentVariables($_).TrimEnd("\") -ieq $dir.TrimEnd("\") }
      if (-not $listed) {
        $key.SetValue("Path", (($entries + $dir) -join ";"), [Microsoft.Win32.RegistryValueKind]::ExpandString)
        Publish-Environment
        Write-Host "Added $dir to the $($scope.ToLowerInvariant())'s Path."
      }
    } finally {
      $key.Close()
    }
    if (-not (($env:Path -split ";") | Where-Object { $_.TrimEnd("\") -ieq $dir.TrimEnd("\") })) {
      $env:Path = "$env:Path;$dir"
    }
    Write-Host "Run: redvars --help (in a new terminal, if this one does not find it)"
  } catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    # install.cmd exits with it.
    $global:LASTEXITCODE = 1
  }
} $Target
