cd $(dirname $0)

if [ $# -eq 1 ]; then
    REBUILD=$1
else
    REBUILD="y"
fi

PACKAGE_PATH=$(realpath ../../ts-util/tauri-fs-util)
PACKAGE_NAME=tauri-fs-util
PROJECT_PATH=../Structural-core

./reinstall-package.sh $PACKAGE_PATH $PACKAGE_NAME $REBUILD $PROJECT_PATH TS
