cd ..

# Build dist folder
cd windmill/http/app/
npm run-script build

# Update git ...
cd ../../../

# Poetry build
poetry build
poetry publish -u $0 -p $1