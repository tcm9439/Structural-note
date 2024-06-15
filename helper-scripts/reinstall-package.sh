# cd to the dir of this file 
# so that the following relative path will work even this script is called from other dir
THIS_SCRIPT_DIR=$(dirname $(realpath $0))
cd $THIS_SCRIPT_DIR

PACKAGE_PATH=$1
PACKAGE_NAME=$2
REBUILD=$3
PROJECT_PATH=$4
FRAMEWORK=$5

# if second parameter exists and is n, skip the build step
if [ "$REBUILD" != "n" ]; then
    echo ======================
    echo "Building..."
    echo ======================
    cd $PACKAGE_PATH
    rm -rf lib lib-types
    npm run build-all
fi

cd $THIS_SCRIPT_DIR
cd $PROJECT_PATH
echo
echo ======================
echo "Unistalling..."
echo ======================
npm uninstall $PACKAGE_NAME
rm -fr ./node_modules/$PACKAGE_NAME

if [ "$FRAMEWORK" = "NUXT" ]; then
    echo
    echo ======================
    echo "Clean Nuxt..."
    echo ======================
    npx nuxi cleanup
fi

echo
echo ======================
echo "Installing..."
echo ======================
npm install $PACKAGE_PATH 
npm install --install-links
