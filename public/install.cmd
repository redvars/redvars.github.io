@echo off
rem Installs the redvars CLI on Windows, from CMD:
rem
rem   curl -fsSL https://redvars.com/install.cmd -o install.cmd && install.cmd && del install.cmd
rem   install.cmd preview    (or a version, such as 0.3.0)
rem
rem Runs install.ps1 in Windows PowerShell, which every Windows has; see that file.
setlocal
set "TARGET=%~1"
if "%TARGET%"=="" set "TARGET=stable"
powershell -NoProfile -Command "& ([scriptblock]::Create((Invoke-RestMethod -UseBasicParsing https://redvars.com/install.ps1))) '%TARGET%'; exit $LASTEXITCODE"
exit /b %ERRORLEVEL%
