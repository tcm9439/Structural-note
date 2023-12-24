// https://nuxt.com/docs/api/configuration/nuxt-config

// ignore the test pages when building for production
let ignore_files = [ "pages/test/*" ]
if (process.env.MT_APP_ENV === "test") {
    ignore_files = []
}

export default defineNuxtConfig({
    devtools: { enabled: false },
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
    ignore: ignore_files,
})
