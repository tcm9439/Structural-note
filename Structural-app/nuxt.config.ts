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
        public: {
            tauriEnv: false,
        },
    },
    ignore: ignore_files,
})
