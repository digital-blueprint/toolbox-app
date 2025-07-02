export default {
    test: {
        basePath: '/',
        typesense: {
            host: 'toolbox-backend-dev.tugraz.at',
            port: '443',
            protocol: 'https',
            key: 'bRQ0Hrg9SAPGR3CVu5hm5bBTggUhsq0e',
        },
        searchIndexName: 'software-overview',
        daysStillNew: 31,
        email: 'hello@digitalblueprint.at',
    },
    local: {
        basePath: '/',
        typesense: {
            host: 'localhost',
            port: '8108',
            protocol: 'http',
            key: 'xyz',
        },
        searchIndexName: 'software-overview',
        daysStillNew: 31,
        email: 'hello@digitalblueprint.at',
    },
    development: {
        basePath: '/',
        typesense: {
            host: 'toolbox-backend-dev.tugraz.at',
            port: '443',
            protocol: 'https',
            key: 'bRQ0Hrg9SAPGR3CVu5hm5bBTggUhsq0e',
        },
        searchIndexName: 'software-overview',
        daysStillNew: 31,
        email: 'hello@digitalblueprint.at',
    },
    demo: {
        basePath: '/',
        typesense: {
            host: 'toolbox-backend-demo.tugraz.at',
            port: '443',
            protocol: 'https',
            key: '8TuZ6RG3HZicFLIf7KjmHG2GJwYTWepk',
        },
        searchIndexName: 'software-overview',
        daysStillNew: 31,
        email: 'hello@digitalblueprint.at',
    },
    production: {
        basePath: '/',
        typesense: {
            host: 'toolbox-backend.digital-blueprint.org',
            port: '443',
            protocol: 'https',
            key: 'ejtFEuR6LsYabwb9m4yEi4KHlmvWXagU',
        },
        searchIndexName: 'software-overview',
        daysStillNew: 31,
        email: 'hello@digitalblueprint.at',
    },
    production_test: {
        basePath: '/',
        typesense: {
            host: 'search-backend.digital-blueprint.org',
            port: '443',
            protocol: 'https',
            key: 'qbBrf1jfxSlm25vuzrLWCnJwtnWhixDL',
        },
        searchIndexName: 'software-overview',
        daysStillNew: 31,
        email: 'hello@digitalblueprint.at',
    },
};
