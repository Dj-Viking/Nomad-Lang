require("dotenv").config();

const {
  TEST_EMAIL,
  TEST_HOST,
  TEST_PASS,
  TEST_USERNAME
} = process.env;

export const COOKIE_NAME: string = "sid";
export const IS_PROD: boolean | undefined = process.env.NODE_ENV === "production";

export const APP_DOMAIN_PREFIX: string | undefined = IS_PROD
? "https://not_made_yet"
: "http://localhost:8080";
export const FORGET_PASS_PREFIX: string = "forget-password:";
export const HOST: string | undefined = TEST_HOST;
export const REGISTER_EMAIL: string | undefined = TEST_EMAIL;
export const REGISTER_USERNAME: string | undefined = TEST_USERNAME;
export const REGISTER_PASSWORD: string | undefined = TEST_PASS;
export const UPDATED_USERNAME: string = `newUsername${Date.now()}`;
export const UPDATED_CARD_TEXT: string = "some update text for editing a card";

/**
 * query to check that when i log in that i can get my information from the db while logged in
 */
export const ME_QUERY: string = `
  query me {
    me {
      email
      username
    }
  }
`;

/**
 * string literal of the graphql mutation for the register action
 */
export const REGISTER_MUTATION: string = `
mutation register {
  register(options: {
    email: "${REGISTER_EMAIL}",
    password: "${REGISTER_PASSWORD}",
    username: "${REGISTER_USERNAME}"
  }){
    token
    errors {
      field
      message
    }
    user{
      email
      username
      id
    }
  }
}
`;