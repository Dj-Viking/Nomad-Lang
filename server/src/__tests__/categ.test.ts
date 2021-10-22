// import { createCategorizedCardsObject } from "./utils/createCategorizedCardsObject";
import { /*ICard,*/ AddCardPayload, AddCardResponse, ICard, MeQueryResponse, RegisterResponse } from "../types";
import { request } from "graphql-request";
import { HOST, REGISTER_EMAIL, REGISTER_MUTATION } from "../constants";
import { ColorLog, createAddCardMutation, createMeQuery, logJson } from "./utils/helpers";
import { connectDb } from "./utils/connectDb";
import { User } from "../entities/User";
import { decodeToken } from "../utils/decodeToken";
import { createCategorizedCardsObject } from "./utils/createCategorizedCardsObject";

let creatorId: number = 0;
let newCardId: number | undefined = 0;
let newUserId: number = 0;
let newToken: string = "";
let userEmail: string = "";
let connection;

const {
  EXPIRED_TOKEN
} = process.env;
describe("Tests the user register", () => {
  it("get expected response from the register mutation", async () => {
    new ColorLog("purple", "registering a new user").genLog();
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    console.log('user', res);

    
    expect(res.register.token).toBeTruthy();
    expect(typeof res.register.user.id).toBe("number");
    creatorId = res.register.user.id;
    newUserId = res.register.user.id;
    expect(creatorId).toBeTruthy();
    userEmail = res.register.user.email;
    newToken = res.register.token;
    expect(res.register.errors).toBeNull();
    expect(userEmail).toEqual(REGISTER_EMAIL);
  });
  
  it("and check that the user got added to the db", async () => {
    new ColorLog("purple", "checking that the user got added to the DB").genLog();
    connection = await connectDb();
    const users = await User.find({ where: { email: REGISTER_EMAIL }});
    logJson(users);
    expect(users).toHaveLength(1);
    connection.close();
  });

  it("checks if we try to register with the same credentials it returns an error", async () => {
    new ColorLog("purple", "trying to register the same user credentials").genLog();
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    expect(res.register.errors).toHaveLength(1);
  });

  it("checks the me query is returning the unauthenticated error", async () => {
    //expired or unauthenticated token test
    const invalidToken: MeQueryResponse = await request(
      HOST + "/graphql", 
      `${createMeQuery()}`,
      {},
      { "authorization": `Bearer asdfasdf` }
    );
    console.log("request with invalid token", invalidToken);
    expect(invalidToken.me.errors).toHaveLength(1);
    expect(invalidToken.me.errors[0].message).toBe("401 user not authenticated");
  });
  it("checks the me query is returning the unauthenticated error", async () => {
    //expired or unauthenticated token test
    const expired: MeQueryResponse = await request(HOST + "/graphql", `${createMeQuery()}`, {}, {
      "authorization": `Bearer ${EXPIRED_TOKEN}`
    });
    console.log("request with expired token", expired);
    expect(expired.me.errors).toHaveLength(1);
    expect(expired.me.errors[0].message).toBe("401 user not authenticated");
  });
  
  it("should successfully add a Card with the proper credentials", async () => {
    //this should all be good, user is authenticated and 
    // the requestor's id is the id of the original CardList creator
    const addCardPayload: AddCardPayload = {
      options: {
        frontSideText: "add card front side text",
        frontSideLanguage: "add card front side language",
        frontSidePicture: "add card front side picture",
        backSideText: "add card backside text",
        backSideLanguage: "add card backside language",
        backSidePicture: "add card backside picture"
      }
    }
    const res: AddCardResponse = await request(
      HOST + "/graphql", 
      `${createAddCardMutation()}`, 
      { options: addCardPayload.options },
      { "authorization":  `Bearer ${newToken}`}
    );
  
    expect(res.addCard.errors).toBeNull();
    logJson(res.addCard);
    console.log("\x1b[32m", "res add card", res.addCard, "\x1b[00m");
    console.log("\x1b[33m", "creatorId at this point", newUserId, "\x1b[00m");
    //find the Cards that have the creator's id
    const foundCard = res.addCard.cards?.filter((card: ICard) => card.creatorId === newUserId)[0];
    console.log("did i find the card i just made?", foundCard);
  
    expect(typeof foundCard?.id).toBe("number");
    expect(typeof foundCard?.creatorId).toBe("number");
    newCardId = foundCard?.id;
    expect(typeof newCardId).toBe("number");  
    expect(foundCard?.creatorId).toEqual(creatorId);
  });
    
    

  it("checks that we can perform a me query with our new token after registering and also get back a new token", async () => {
    new ColorLog("yellow", "testing mequery to get a refresh token").genLog();
    
    const res: MeQueryResponse = await request(HOST + "/graphql", `${createMeQuery()}`, {}, {
      "authorization": `Bearer ${newToken}`
    });

    console.log("errors length property should be undefined: ", res.me.errors?.length);

    //if the length of the actual array is 0 for some reason the length property is set to typeof "undefined"
    expect(res.me.cards).toHaveLength(1);

    //shove all cards into categorized object create function
    const categorizedCardsObj = createCategorizedCardsObject(res.me.cards);

    console.log("\x1b[33m", JSON.stringify(categorizedCardsObj, null, 2));

    expect(categorizedCardsObj).toStrictEqual(JSON.parse(`{
      "add card front side language": {
        "cards": [
          {
            "id": ${newCardId},
            "frontSideText": "add card front side text",
            "frontSideLanguage": "add card front side language",
            "frontSidePicture": "add card front side picture",
            "backSideText": "add card backside text",
            "backSideLanguage": "add card backside language",
            "backSidePicture": "add card front side picture"
          }
        ]
      }
    }`
));

    expect(res.me.errors).toBeNull();
    expect(res.me.user.token).toBeTruthy();

    //check if old token is expired
    //get new token
    newToken = res.me.user.token as string;

    console.log("new token", newToken);
    
    expect(newToken).toBeTruthy();
    console.log("me query response test", res);
  });

  it("does me query again and checks that the old token is not the same as the one sent back from the me query", async () => {
    // const decoded = decodeToken(newToken) as jwt.JwtPayload;
    new ColorLog("yellow", "testing me query again to get a new refresh token should be different than the previous newToken").genLog();

    console.log("decoded token previous", decodeToken(newToken));

    async function sleep(ms:number): Promise<void> {
      return new Promise((resolve, _reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    await sleep(1000)

    const newerMe: MeQueryResponse = await request(HOST + "/graphql", `${createMeQuery()}`, {}, {
      "authorization": `Bearer ${newToken}`
    });
    //check that the token is different than the previous one
    new ColorLog("blue",  `me query OLD TOKEN ${newToken}`, ).genLog();
    new ColorLog("blue", `me query user NEW TOKEN ${newerMe.me.user && newerMe.me.user.token ? newerMe.me.user.token : "couldn't get a token"}`).genLog();
    new ColorLog("blue", `me query outside user NEW TOKEN ${newerMe.me.token}`).genLog();

    expect(newerMe.me.token !== newToken).toBe(true);
  });

  it("checks if we delete the user we just made", async () => {
    connection = await connectDb();
    await User.delete({ email: REGISTER_EMAIL });
    const users = await User.find({ where: { email: REGISTER_EMAIL } });
    new ColorLog("green", "deleting a user").genLog();
    logJson(users);
    expect(users).toHaveLength(0);
    connection.close();
  }); 
});