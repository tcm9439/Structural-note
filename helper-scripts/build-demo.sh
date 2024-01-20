# deploy the demo page to github pages
# reference: https://clairechang.tw/2023/10/03/nuxt3/nuxt-v3-static-site-generation/

cd $(dirname $0)

# clean the demo repo
cd ../../Structural-demo
rm -rf _nuxt/
find . -type f -name '*.html' -delete
find . -type f -name '*.ico' -delete

cd ../Structural/Structural-app
npm run build-demo

cp -r dist/* ../../Structural-demo

# then commit and push to the gh-pages branch
