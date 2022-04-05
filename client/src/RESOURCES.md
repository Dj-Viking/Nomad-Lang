* getting some weird bug with logging in the token does not come back with the user object.
    * had to use async iffe to get an uncorrupt response
    ```ts
    (async () => {
      await submitLogin(args);
    })()

    const exampleVueInstance = {
      methods: {
        async submitLogin(args) {
          //do async login stuff
        }
      }
    }
    ```

* starting to add jest tests to this vue app
  - <a href="https://test-utils.vuejs.org/guide/#what-is-vue-test-utils" rel="noopener noreferrer">Vue test utils docs</a>

* Learning how to mock router because the default behavior of vue-test-utils does not render out the html for the components nested inside the RouteRecordRaw[] Array
  - <a href="https://www.npmjs.com/package/vue-router-mock?activeTab=readme" rel="noopener noreferrer">vue-router-mock on npmjs</a>