#!/usr/bin/env bash
# Installs the redvars CLI on Linux, macOS and WSL:
#
#   curl -fsSL https://redvars.com/install.sh | bash
#   curl -fsSL https://redvars.com/install.sh | bash -s preview    # or a version, such as 0.3.0
#
# Reads the version and the executable's SHA-256 from the store (v1/cli/<stable|preview|version>.txt
# on https://store.redvars.com), downloads the executable from the store's GitHub release, checks the
# digest, and puts it in ~/.local/bin, or in /usr/local/bin when run as root, so that services can
# run it. `redvars upgrade` updates it and `redvars uninstall` removes it.
#
# PLATFORM_STORE_URL and PLATFORM_RELEASES_URL point it at a mirror of the store and its releases.

VERSION_PATTERN='^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$'
download=""

# Everything runs from main, called on the last line, so a download cut short runs nothing.
main() {
  set -euo pipefail

  local target="${1:-stable}"
  if [ "$target" != stable ] && [ "$target" != preview ] && ! [[ "$target" =~ $VERSION_PATTERN ]]; then
    fail "the version is stable, preview or a version such as 0.3.0, not \"$target\""
  fi
  local store="${PLATFORM_STORE_URL:-https://store.redvars.com}"
  local releases="${PLATFORM_RELEASES_URL:-https://github.com/redvars/store/releases/download}"
  command -v curl >/dev/null 2>&1 || command -v wget >/dev/null 2>&1 || fail "needs curl or wget"
  command -v sha256sum >/dev/null 2>&1 || command -v shasum >/dev/null 2>&1 || fail "needs sha256sum or shasum to check the download"

  local os arch
  case "$(uname -s)" in
    Linux) os=linux ;;
    Darwin) os=darwin ;;
    MINGW* | MSYS* | CYGWIN*) fail "on Windows, run this in PowerShell instead: irm https://redvars.com/install.ps1 | iex" ;;
    *) fail "redvars runs on Linux, macOS and Windows, not $(uname -s)" ;;
  esac
  case "$(uname -m)" in
    x86_64 | amd64) arch=x64 ;;
    arm64 | aarch64) arch=arm64 ;;
    *) fail "redvars runs on x64 and arm64, not $(uname -m)" ;;
  esac
  # A shell under Rosetta reports x64 on an Apple silicon Mac; the arm64 executable is the one to run.
  if [ "$os" = darwin ] && [ "$arch" = x64 ] && [ "$(sysctl -n sysctl.proc_translated 2>/dev/null)" = 1 ]; then
    arch=arm64
  fi
  if [ "$os" = linux ] && ldd --version 2>&1 | grep -qi musl; then
    fail "redvars needs glibc; musl systems such as Alpine are not supported yet"
  fi

  local index
  if ! index="$(fetch "$store/v1/cli/$target.txt")"; then
    if [ "$target" = stable ]; then
      fail "the store has no stable release of the CLI yet; for the newest preview: curl -fsSL https://redvars.com/install.sh | bash -s preview"
    fi
    fail "the store has no CLI release \"$target\" ($store/v1/cli/$target.txt)"
  fi
  local version digest="" file=""
  version="$(printf '%s\n' "$index" | head -n 1)"
  read -r digest file < <(printf '%s\n' "$index" | awk -v wanted="$os-$arch" '$1 == wanted { print $2, $3; exit }') || true
  if ! [[ "$version" =~ $VERSION_PATTERN ]]; then
    fail "the store's list for $target is not one this installer reads"
  fi
  if [ -z "$digest" ]; then
    fail "redvars $version has no executable for $os-$arch"
  fi
  if ! [[ "$digest" =~ ^[0-9a-f]{64}$ && "$file" =~ ^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$ ]]; then
    fail "the store's list for $target is not one this installer reads"
  fi

  local dir
  if [ "$(id -u)" = 0 ]; then dir=/usr/local/bin; else dir="$HOME/.local/bin"; fi
  mkdir -p "$dir"

  # Downloaded into the install folder, so the last step is a rename, even over a running redvars.
  download="$dir/.redvars-$version.download"
  trap 'rm -f "$download"' EXIT
  echo "Downloading redvars $version for $os-$arch"
  fetch "$releases/$file" >"$download" || fail "could not download $releases/$file"
  local actual
  actual="$(sha256 "$download")"
  if [ "$actual" != "$digest" ]; then
    fail "the download's SHA-256 is $actual, not $digest as the store lists it; nothing was installed"
  fi
  chmod 755 "$download"
  "$download" --version >/dev/null 2>&1 || fail "redvars $version does not run on this system; nothing was installed"
  mv -f "$download" "$dir/redvars"
  trap - EXIT

  echo "Installed redvars $version at $dir/redvars"
  case ":$PATH:" in
    *":$dir:"*) echo "Run: redvars --help" ;;
    *) path_help "$dir" ;;
  esac
}

fail() {
  echo "install.sh: $1" >&2
  exit 1
}

# A URL's body on stdout; fails on an HTTP error.
fetch() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL --retry 2 "$1"
  else
    wget -q -O - "$1"
  fi
}

sha256() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | cut -d ' ' -f 1
  else
    shasum -a 256 "$1" | cut -d ' ' -f 1
  fi
}

# How to put the folder on the PATH of the user's shell; this script changes no shell profile.
path_help() {
  local dir="$1" profile
  case "$(basename "${SHELL:-sh}")" in
    zsh) profile="$HOME/.zshrc" ;;
    bash) if [ "$(uname -s)" = Darwin ]; then profile="$HOME/.bash_profile"; else profile="$HOME/.bashrc"; fi ;;
    fish)
      echo "$dir is not on your PATH. Add it with: fish_add_path $dir"
      return
      ;;
    *) profile="$HOME/.profile" ;;
  esac
  echo "$dir is not on your PATH. Add it, then open a new terminal:"
  echo "  echo 'export PATH=\"$dir:\$PATH\"' >> $profile"
}

main "$@"
