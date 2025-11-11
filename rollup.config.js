import url from 'node:url';
import {globSync} from 'node:fs';
import {replacePlugin} from 'rolldown/plugins';
import serve from 'rollup-plugin-serve';
import license from 'rollup-plugin-license';
import emitEJS from 'rollup-plugin-emit-ejs';
import appConfig from './app.config.js';
import {getBabelOutputPlugin} from '@rollup/plugin-babel';
import {
    getPackagePath,
    getBuildInfo,
    generateTLSConfig,
    getDistPath,
    assetPlugin,
} from '@dbp-toolkit/dev-utils';
import {createRequire} from 'node:module';
import process from 'node:process';

const require = createRequire(import.meta.url);
let appName = 'dbp-overview-app';
const pkg = require('./package.json');
const appEnv = typeof process.env.APP_ENV !== 'undefined' ? process.env.APP_ENV : 'local';
const watch = process.env.ROLLUP_WATCH === 'true';
const prodBuild = (!watch && appEnv !== 'test') || process.env.FORCE_FULL !== undefined;
let nodeEnv = prodBuild ? 'production' : 'development';

let config;
if (appEnv in appConfig) {
    config = appConfig[appEnv];
} else {
    console.error(`Unknown build environment: '${appEnv}', use one of '${Object.keys(appConfig)}'`);
    process.exit(1);
}

if (watch) {
    config.basePath = '/dist/';
}

config.CSP = `default-src 'self' 'unsafe-eval' 'unsafe-inline' \
    ${config.typesense.protocol + '://' + config.typesense.host + ':' + config.typesense.port}; \
    img-src * blob: data:`;

export default (async () => {
    let privatePath = await getDistPath(pkg.name);
    return {
        input: appEnv !== 'test' ? ['src/' + appName + '.js'] : globSync('test/**/*.js'),
        output: {
            dir: 'dist',
            entryFileNames: '[name].js',
            chunkFileNames: 'shared/[name].[hash].js',
            format: 'esm',
            sourcemap: true,
            minify: prodBuild,
            cleanDir: true,
        },
        treeshake: prodBuild,
        onwarn: function (warning, warn) {
            // ignore chai warnings
            if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.message.includes('chai')) {
                return;
            }

            warn(warning);
        },
        plugins: [
            emitEJS({
                src: 'assets',
                include: ['**/*.ejs', '**/.*.ejs'],
                data: {
                    getUrl: (p) => {
                        return url.resolve(config.basePath, p);
                    },
                    getPrivateUrl: (p) => {
                        return url.resolve(`${config.basePath}${privatePath}/`, p);
                    },
                    name: appName,
                    basePath: config.basePath,
                    CSP: config.CSP,
                    buildInfo: getBuildInfo(appEnv),
                    typesense: config.typesense,
                    searchIndexName: config.searchIndexName,
                    daysStillNew: config.daysStillNew,
                    email: config.email,
                },
            }),
            replacePlugin(
                {
                    'process.env.NODE_ENV': JSON.stringify(nodeEnv),
                },
                {
                    preventAssignment: true,
                },
            ),
            prodBuild &&
                license({
                    banner: {
                        commentStyle: 'ignored',
                        content: `
    License: <%= pkg.license %>
    Dependencies:
    <% _.forEach(dependencies, function (dependency) { if (dependency.name) { %>
    <%= dependency.name %>: <%= dependency.license %><% }}) %>
    `,
                    },
                    thirdParty: {
                        allow: {
                            test: '(MIT OR BSD-3-Clause OR Apache-2.0 OR LGPL-2.1-or-later OR 0BSD)',
                            failOnUnlicensed: true,
                            failOnViolation: true,
                        },
                    },
                }),
            await assetPlugin(pkg.name, 'dist', {
                copyTargets: [
                    {src: 'assets/silent-check-sso.html', dest: 'dist'},
                    {src: 'assets/htaccess-shared', dest: 'dist/shared/', rename: '.htaccess'},
                    {src: 'assets/*.css', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {src: 'assets/*.ico', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {src: 'assets/*.svg', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {src: 'assets/*.png', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {src: 'assets/icon/*', dest: 'dist/' + (await getDistPath(pkg.name, 'icon'))},
                    {src: 'assets/font/*', dest: 'dist/' + (await getDistPath(pkg.name, 'font'))},
                    {
                        src: await getPackagePath('instantsearch.css', 'themes/algolia-min.css'),
                        dest: 'dist/',
                    },
                    {src: 'assets/manifest.json', dest: 'dist', rename: appName + '.manifest.json'},
                    {src: 'assets/*.metadata.json', dest: 'dist'},
                ],
            }),
            prodBuild &&
                getBabelOutputPlugin({
                    compact: false,
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                loose: false,
                                modules: false,
                                shippedProposals: true,
                                bugfixes: true,
                                targets: {
                                    esmodules: true,
                                },
                            },
                        ],
                    ],
                }),
            watch
                ? serve({
                      contentBase: '.',
                      host: '127.0.0.1',
                      port: 8009,
                      historyApiFallback: config.basePath + appName + '.html',
                      https: await generateTLSConfig(),
                      headers: {
                          'Content-Security-Policy': config.CSP,
                      },
                  })
                : false,
        ],
    };
})();
