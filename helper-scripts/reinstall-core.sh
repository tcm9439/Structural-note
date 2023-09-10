# cd to the dir of this file 
# so that the following relative path will work even this script is called from other dir
cd $(dirname $0)

# if second parameter exista ans is n, skip the build step
if [ "$1" != "n" ]; then
    echo ======================
    echo "Building..."
    echo ======================
    cd ../Structural-core
    rm -rf lib lib-types
    npm run build-all
fi

cd ../Structural-app
echo
echo ======================
echo "Unistalling..."
echo ======================
npm uninstall ../Structural-core 
npx nuxi clean
rm -fr ./node_modules/structural-core

echo
echo ======================
echo "Installing..."
echo ======================
npm install ../Structural-core 
npm install --install-links

echo
echo ======================
echo "Checking..."
echo ======================
ls -lah ./node_modules/ | grep structural-core
