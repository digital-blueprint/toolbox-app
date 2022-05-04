export default {
    test: {
        basePath: '/',
        typesense: {
            host: 'typesense-dev.tugraz.at',
            port: '443',
            protocol: 'https',
            key: '',
        }
    },
    local: {
        basePath: '/dist/',
        typesense: {
            host: 'localhost',
            port: '8108',
            protocol: 'http',
            key: 'xyz',
        }
    },
    development: {
        basePath: '/',
        typesense: {
            host: 'typesense-dev.tugraz.at',
            port: '443',
            protocol: 'https',
            key: 'bRQ0Hrg9SAPGR3CVu5hm5bBTggUhsq0e',
        }
    },
    demo: {
        basePath: '/',
        typesense: {
            host: 'typesense-dev.tugraz.at',
            port: '443',
            protocol: 'https',
            key: 'bRQ0Hrg9SAPGR3CVu5hm5bBTggUhsq0e',
        }
    },
    production: {
        basePath: '/',
        typesense: {
            host: 'typesense-dev.tugraz.at',
            port: '443',
            protocol: 'https',
            key: 'bRQ0Hrg9SAPGR3CVu5hm5bBTggUhsq0e',
        }
    },
};
