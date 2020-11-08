npm run build
rm -rf ../backend/public
mkdir ../backend/public
cp -a dist/. ../backend/public
