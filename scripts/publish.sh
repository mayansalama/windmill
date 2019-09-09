# Run NPM build
cd windmill/http/app/
npm run-script build

# Update git ...
cd ../../../

# Poetry build
poetry build
poetry publish