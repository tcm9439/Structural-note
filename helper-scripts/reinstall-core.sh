cd $(dirname $0)

if [ $# -eq 1 ]; then
    REBUILD=$1
else
    REBUILD="y"
fi

PACKAGE_PATH=../Structural-core
PACKAGE_NAME=structural-core
PROJECT_PATH=../Structural-app

./reinstall-package.sh $PACKAGE_PATH $PACKAGE_NAME $REBUILD $PROJECT_PATH NUXT
