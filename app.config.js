export default {
    test: {
        basePath: '/',
        typesense: {
            host: 'typesense-dev.tugraz.at',
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
            host: 'typesense-dev.tugraz.at',
            port: '443',
            protocol: 'https',
            key: 'bRQ0Hrg9SAPGR3CVu5hm5bBTggUhsq0e',
        },
        email: 'eugen.neuber@tugraz.at'
    },
    demo: {
        basePath: '/',
        typesense: {
            host: 'typesense-demo.tugraz.at',
            port: '443',
            protocol: 'https',
            key: '8TuZ6RG3HZicFLIf7KjmHG2GJwYTWepk',
        },
        email: 'hello@digitalblueprint.at'
    },
    production: {
        basePath: '/',
        typesense: {
            host: 'typesense-demo.tugraz.at',
            port: '443',
            protocol: 'https',
            key: '8TuZ6RG3HZicFLIf7KjmHG2GJwYTWepk',
        },
        email: 'hello@digitalblueprint.at'
    },
};
