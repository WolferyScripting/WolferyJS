#!/bin/sh
npx rimraf dist

npx tsc -p tsconfig.build.esm.json
npx tsc-alias -p tsconfig.build.esm.json
npx copyfiles -u 1 "lib/**/*.d.ts" dist/esm
find dist/esm -type f -name "*.js" -exec sh -c 'mv "$1" "${1%.js}".mjs' - '{}' \;
find dist/esm -type f -name "*.ts" -exec sh -c 'mv "$1" "${1%.ts}".mts' - '{}' \;
find dist/esm \( -name "*.mjs" -o -name "*.mts" \) -exec sed -i -E 's#\./([A-Za-z0-9._/-]+)\.(t|j)s#./\1.m\2s#g' {} +

npx tsc -p tsconfig.build.cjs.json
npx tsc-alias -p tsconfig.build.cjs.json
npx copyfiles -u 1 "lib/**/*.d.ts" dist/cjs
find dist/cjs -type f -name "*.js" -exec sh -c 'mv "$1" "${1%.js}".cjs' - '{}' \;
find dist/cjs -type f -name "*.ts" -exec sh -c 'mv "$1" "${1%.ts}".cts' - '{}' \;
find dist/cjs \( -name "*.cjs" -o -name "*.cts" \) -exec sed -i -E 's#\./([A-Za-z0-9._/-]+)\.(t|j)s#./\1.c\2s#g' {} +
