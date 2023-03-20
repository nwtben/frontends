import transformerDirective from "@unocss/transformer-directives";
import { NuxtConfig } from '@nuxt/types';
// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  shopware: {
    shopwareEndpoint: "https://shopware.nwtsaas.com",
    shopwareAccessToken: "SWSCNHRXAKTEBW12C1NETUPVVW",
  },
  alias: {
    /**
     * TODO: Temp fix until new VueUse published:
     * - https://github.com/vueuse/vueuse/pull/2449
     * - https://github.com/vueuse/vueuse/actions/workflows/publish.yml
     */
    useMeta: "~/composables/useMeta",
  },
  typescript: {
    typeCheck: true,
    strict: true,
  },
  modules: [
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@shopware-pwa/nuxt3-module",
    "@shopware-pwa/cms-base",
    "@nuxt/image-edge",
    `@twicpics/components/nuxt3`,
  ],
  "twicpics": {
        domain: `https://turnkey-shopware.twic.pics`,
        anticipation: 0.5,
        step: 50
  },
  // components: true,
  components: {
    dirs: ["~/components"],
    global: true,
  },
  vueuse: {
    ssrHandlers: true,
  },
  // Unocss bug fix https://github.com/nuxt/framework/issues/7623
  experimental: {
    inlineSSRStyles: false,
  },
  nitro: {
    compressPublicAssets: true,
  },
  unocss: {
    uno: true, // enabled `@unocss/preset-uno`
    icons: {
      collections: {
        custom: {
          facebook: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>'
        }
      }
    }, // enabled `@unocss/preset-icons`
    attributify: true, // enabled `@unocss/preset-attributify`,
    preflight: true,
    transformers: [transformerDirective()],
    theme: {
      extend: {
        width: "width",
        height: "height",
      },
      container: {
        padding: '1rem',
      },
      colors: {
        brand: {
          primary: "#1F2937",
          light: "#5ebbff",
          dark: "#374151",
        },
        gray: {
          200: '#D1D5DB',
          300: '#9CA3AF',
          400: '#6B7280',
          500: '#F3F4F6',
          600: '#4B5563'
        },
      },
    },
  },
  router: {
    options: {
      linkExactActiveClass: "text-brand-primary",
    },
  },
  ssr: true,

});
