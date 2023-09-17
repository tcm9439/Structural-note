cd $(dirname $0)

if [ $# -eq 1 ]; then
    REBUILD=$1
else
    REBUILD="y"
fi

PACKAGE_PATH=../Structural-core
PACKAGE_NAME=structural-core
PROJECT_PATH=../Structural-app

# fix the local transitive dependency
ABS_FS_LIB_PATH=$(realpath ../../ts-util/tauri-fs-util)
ls -la "$PACKAGE_PATH/package.json"
sed -i '' "s|file:../../ts-util/tauri-fs-util|file:$ABS_FS_LIB_PATH|g" "$PACKAGE_PATH/package.json"

./reinstall-package.sh $PACKAGE_PATH $PACKAGE_NAME $REBUILD $PROJECT_PATH NUXT
