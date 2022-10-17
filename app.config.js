export default {
    test: {
        basePath: '/',
        typesense: {
            host: 'toolbox-backend-dev.tugraz.at',
            port: '443',
            protocol: 'https',
            key: 'bRQ0Hrg9SAPGR3CVu5hm5bBTggUhsq0e',
        },
        email: 'test@localhost.lan'
    },
    local: {
        basePath: '/',
        typesense: {
            host: 'localhost',
            port: '8108',
            protocol: 'http',
            key: 'xyz',
        },
        email: 'test@localhost.lan'
    },
    development: {
        basePath: '/',
        typesense: {
            host: 'toolbox-backend-dev.tugraz.at',
            port: '443',
            protocol: 'https',
            key: 'bRQ0Hrg9SAPGR3CVu5hm5bBTggUhsq0e',
        },
        email: 'eugen.neuber@tugraz.at'
    },
    demo: {
        basePath: '/',
        typesense: {
            host: 'toolbox-backend-demo.tugraz.at',
            port: '443',
            protocol: 'https',
            key: '8TuZ6RG3HZicFLIf7KjmHG2GJwYTWepk',
        },
        email: 'hello@digitalblueprint.at'
    },
    production: {
        basePath: '/',
        typesense: {
            host: 'toolbox-backend.digital-blueprint.org',
            port: '443',
            protocol: 'https',
            key: 'ejtFEuR6LsYabwb9m4yEi4KHlmvWXagU',
        },
        email: 'hello@digitalblueprint.at'
    },
    production_test: {
        basePath: '/',
        typesense: {
            host: 'search-backend.digital-blueprint.org',
            port: '443',
            protocol: 'https',
            key: 'qbBrf1jfxSlm25vuzrLWCnJwtnWhixDL',
        },
        email: 'hello@digitalblueprint.at'
    },
};
