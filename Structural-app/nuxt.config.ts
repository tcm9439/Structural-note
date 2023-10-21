// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: false },
    ssr: false,
    modules: [
        "nuxt-icon",
        "@vueuse/nuxt",
    ]
});
