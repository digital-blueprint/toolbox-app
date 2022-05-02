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
        basePath: '/apps/starter-app/',
        typesense: {
            host: 'typesense-dev.tugraz.at',
            port: '443',
            protocol: 'https',
            key: '',
        }
    },
    demo: {
        basePath: '/apps/starter-app/',
        typesense: {
            host: 'typesense-dev.tugraz.at',
            port: '443',
            protocol: 'https',
            key: '',
        }
    },
    production: {
        basePath: '/',
        typesense: {
            host: 'typesense-dev.tugraz.at',
            port: '443',
            protocol: 'https',
            key: '',
        }
    },
};
