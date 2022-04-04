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