echo ======================
echo "Building..."
echo ======================
cd ../Structural-core
rm -rf lib lib-types
npm run build-all

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
