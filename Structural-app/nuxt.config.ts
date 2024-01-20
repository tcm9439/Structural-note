// https://nuxt.com/docs/api/configuration/nuxt-config

// ignore the test pages when building for production
let ignore_files = [ "pages/test/*" ]

// default values for production build
let app_base_url = "/"
let buildAssetsDir = '/_nuxt/'

if (process.env.MT_APP_ENV === "test") {
    // test environment in web
    // will include the test/ pages
    ignore_files = []
} else if (process.env.MT_APP_ENV === "demo") {
    // github pages demo build

    // only include the /test/template
    ignore_files = [ "pages/test/index.vue", "pages/test/empty.vue" ]

    // github repo name for path for getting static assets
    app_base_url = "/structural-note-demo/"

    // `_nuxt` with a _ prefix is ignored by github pages when using jekyll
    buildAssetsDir = '/static/'
}

export default defineNuxtConfig({
    devtools: { enabled: false },
    vite: {
        css: {
            // less css
            preprocessorOptions: {
                less: {
                    additionalData: '@import "./assets/less/mt-variable.less";',
                    javascriptEnabled: true,
                },
            },
        },
    },
    ssr: false,
    modules: [
        "nuxt-icon",
        "@vueuse/nuxt",
    ],
    runtimeConfig: {
        // https://stackoverflow.com/questions/67703133/how-to-use-env-variables-in-nuxt-2-or-3
        public: {
            appEnv: process.env.APP_ENV,
            settingFilepath: process.env.SETTING_FILEPATH,
        },
    },
    app: {
        baseURL: app_base_url,
        buildAssetsDir: buildAssetsDir,
    },
    ignore: ignore_files,
})
