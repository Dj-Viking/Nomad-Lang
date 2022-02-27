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