# DBP Overview App

[GitHub](https://github.com/digital-blueprint/toolbox)

[![? Build, Test and Publish](https://github.com/digital-blueprint/toolbox-app/actions/workflows/build-test-publish.yml/badge.svg)](https://github.com/digital-blueprint/toolbox-app/actions/workflows/build-test-publish.yml)
[![? Create and publish Production Docker image](https://github.com/digital-blueprint/toolbox-app/actions/workflows/build-deploy-docker-image.yml/badge.svg)](https://github.com/digital-blueprint/toolbox-app/actions/workflows/build-deploy-docker-image.yml)

This is an experimental app to display search results for a typesense instance updated by GitLab's CI.
See [DBP Overview Feeder](https://gitlab.tugraz.at/vpu-private/dbp-overview/dbp-overview-feeder)

[Search icons created by Freepik - Flaticon](https://www.flaticon.com/free-icons/search)

## Local development

```bash
# get the source
git clone git@github.com/digital-blueprint/toolbox
cd toolbox
git submodule update --init

# install dependencies
yarn install

# constantly build dist/bundle.js and run a local web-server on port 8001 
yarn run watch

# same as watch, but with babel, terser, etc active -> very slow
yarn run watch-full

# run tests
yarn test

# build for deployment
yarn build
```

Jump to <https://localhost:8001> and you should get the search/result page.

Setup your local Typesense service instance as described in `README.md`
of [DBP Overview Feeder](https://gitlab.tugraz.at/vpu-private/dbp-overview/dbp-overview-feeder)

## Documentation

About search results, see:

- https://typesense.org/docs/guide/
- https://github.com/typesense/typesense-js
- https://github.com/typesense/typesense-instantsearch-adapter
- https://github.com/algolia/instantsearch.js
