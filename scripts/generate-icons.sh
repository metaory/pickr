#!/bin/bash

# Generate PNG icons from SVG source
# Usage: ./generate-icons.sh <svg-file> <sizes> <pattern>
# Example: ./generate-icons.sh icon.svg "16 32 48 128 256" "x_hit_{}.png"
# Output: Creates PNG files in ./res/ directory

svg=$1
sizes=$2
pattern=$3

[ -z "$svg" ] || [ -z "$sizes" ] || [ -z "$pattern" ] && {
  echo "Usage: $0 <svg> <sizes> <pattern>"
  echo "Example: $0 icon.svg '16 32 48 128 256' 'x_hit_{}.png'"
  exit 1
}

mkdir -p res

for size in $sizes; do
  output="res/${pattern//\{\}/$size}"
  magick -background transparent -size ${size}x${size} "$svg" "$output"
  echo "✓ $output"
done
