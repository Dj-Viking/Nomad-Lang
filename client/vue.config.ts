import { VueTsCheckerPlugin } from "@juit/vue-ts-checker";

module.exports = {
  chainWebpack: (config) => {
    // We don't need the "fork-ts-checker" plugin anymore, as "vue-ts-checker"
    // also checks all of the TypeScript included in each compilation!
    config.plugins.delete("fork-ts-checker");

    // Let the "vue-ts-checker" plugin take care of checking Vue and TypeScript
    config.plugin("vue-ts-checker").use(new VueTsCheckerPlugin());
  },
};
