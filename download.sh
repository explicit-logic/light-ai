#!/bin/bash

VERSION=3.3.2

# List of package names to download and unpack
packages=(
  "linux-arm64"
  "linux-x64-cuda"
  "mac-x64"
  "win-x64-cuda"
  "linux-armv7l"
  "linux-x64-vulkan"
  "win-arm64"
  "win-x64-vulkan"
  "linux-x64"
  "mac-arm64-metal"
  "win-x64"
)

for package in "${packages[@]}"; do
  FULL_NAME=@node-llama-cpp/$package
  PACKAGE_NAME=$(npm pack $FULL_NAME@$VERSION)
  mkdir -p ./node_modules/$FULL_NAME && tar -xvzf $PACKAGE_NAME --strip-components=1 -C ./node_modules/$FULL_NAME && rm $PACKAGE_NAME
done
