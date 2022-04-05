const {
  VueRouterMock,
} = require('vue-router-mock');
const { config } = require("@vue/test-utils");

config.plugins.VueWrapper.install(VueRouterMock);