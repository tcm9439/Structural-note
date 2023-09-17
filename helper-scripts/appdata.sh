APP_DATA_PATH="/Users/maisytse/Library/Application Support"
APP_NAME=mt.structural

echo PATH: $APP_DATA_PATH/$APP_NAME
echo
cd "$APP_DATA_PATH"
ls -lha $APP_NAME

if [ "$1" == "rm" ]; then
    echo 
    echo "Removing..."
    rm -rf $APP_NAME
    echo "Removed."
    ls -lha $APP_NAME
elif [ "$1" == "mk" ]; then
    echo 
    echo "Making..."
    mkdir $APP_NAME
    echo "Removed."
    ls -lha $APP_NAME
fi
