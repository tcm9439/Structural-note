echo ======================
echo "Building..."
echo ======================
cd ../Structural-core
npm run build-all

cd ../Structural-app
echo
echo ======================
echo "Unistalling..."
echo ======================
npm uninstall ../Structural-core 
rm -rf ./node_modules/.vite
rm -f ./node_modules/structural-core

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
ls -lah ../Structural-app/node_modules/ | grep structural-core
