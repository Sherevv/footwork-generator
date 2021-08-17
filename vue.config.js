const path = require("path");
const PrerenderSPAPlugin = require("prerender-spa-plugin");
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;

const plugins = process.env.NODE_ENV === 'production' ?
    [
        new PrerenderSPAPlugin({
            // Required - The path to the webpack-outputted app to prerender.
            staticDir: path.join(__dirname, './dist'),
            // Required - Routes to render.
            routes: ['/', '/en/about', '/en/generator', '/en/description', '/en/exercises',
                '/ru/about', '/ru/generator', '/ru/description', '/ru/exercises'],
            renderer: new Renderer({
                renderAfterTime: 2000
            }),
        }),
    ] : [];


module.exports = {
    productionSourceMap: false,
    configureWebpack: {
        resolve: {
            alias: {
                vue$: 'vue/dist/vue.esm-bundler.js',
                'Assets$': 'src/assets',
            },
        },
        plugins: plugins,
        module: {
            rules: [
                {
                    test: /\.ejs$/i,
                    loader: 'ejs-easy-loader'
                },
            ]
        }
    },
    pages: {
        index: {
            entry: 'src/main.ts',
            template: 'src/index.ejs',
        },
    },

    pwa: {
        name: 'The Footwork Generator',
        themeColor: '#409eff',
        msTileColor: '#409eff',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        assetsVersion: '1',

        // настройки манифеста
        manifestOptions: {
            short_name: 'footwork-generator',
            background_color: '#409eff'
            // ...другие настройки манифеста...
        },
        iconPaths: {
            /* // Default
             favicon32: 'img/icons/favicon-32x32.png',
             favicon16: 'img/icons/favicon-16x16.png',
             appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
             maskIcon: 'img/icons/safari-pinned-tab.svg',
             msTileImage: 'img/icons/msapplication-icon-144x144.png'
             */
            appleTouchIcon: 'img/icons/apple-touch-icon-180x180.png',
            msTileImage: 'img/icons/mstile-150x150.png'
        },
        icons: [
            {
                'src': './img/icons/android-chrome-192x192.png',
                'sizes': '192x192',
                'type': 'image/png'
            },
            {
                'src': './img/icons/android-chrome-512x512.png',
                'sizes': '512x512',
                'type': 'image/png'
            },
            {
                'src': './img/icons/android-chrome-maskable-192x192.png',
                'sizes': '192x192',
                'type': 'image/png',
                'purpose': 'maskable'
            },
            {
                'src': './img/icons/android-chrome-maskable-512x512.png',
                'sizes': '512x512',
                'type': 'image/png',
                'purpose': 'maskable'
            },
            {
                'src': './img/icons/android-chrome-maskable-384x384.png',
                'sizes': '384x384',
                'type': 'image/png',
                'purpose': 'maskable'
            },
            {
                'src': './img/icons/android-144x144.png',
                'sizes': '144x144',
                'type': 'image/png'
            },
            {
                'src': './img/icons/android-36x36.png',
                'sizes': '36x36',
                'type': 'image/png'
            },
            {
                'src': './img/icons/android-48x48.png',
                'sizes': '48x48',
                'type': 'image/png'
            },
            {
                'src': './img/icons/android-72x72.png',
                'sizes': '72x72',
                'type': 'image/png'
            },
            {
                'src': './img/icons/android-96x96.png',
                'sizes': '96x96',
                'type': 'image/png'
            },
            {
                'src': './img/icons/android-36x36.png',
                'sizes': '36x36',
                'type': 'image/png'
            },
        ],

        workboxOptions: {
            skipWaiting: true
        }
    }
}
