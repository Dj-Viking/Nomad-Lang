require("dotenv").config();
import { request } from "graphql-request";
import { User } from "../entities/User";
import { connectDb } from "./utils/connectDb";
import {
  REGISTER_MUTATION,
  REGISTER_EMAIL,
  UPDATED_CARD_TEXT,
  HOST,
} from "../constants";
import { RegisterResponse, GetUserCardsResponse, AddCardResponse, ICard, ClearUserCardsResponse, EditCardByIdResponse, EditCardPayload, AddCardPayload } from "../types";
import { ColorLog, logJson, createAddCardMutation, createClearUserCardsMutation, createEditCardMutation, createGetUserCardsQuery } from "./utils/helpers";

const { 
  EXPIRED_TOKEN, 
  // NOT_MY_EMAIL,
  // NOT_FOUND_EMAIL 
} = process.env; 

const logger = ColorLog;
let newToken: string = "";
let creatorId: number = 0;
let newCardId: number | undefined = 0;
let newUserId: number = 0;

describe("Tests the user register", () => {
  it("get expected response from the register mutation", async () => {
    new logger("purple", "Registering a new user with new logger class").genLog();
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    console.log('user', res);

    expect(res.register.errors).toBeNull();

    //assign the creatorId for later when we add a card
    expect(typeof res.register.user.id).toBe("number");
    creatorId = res.register.user.id;
    newUserId = creatorId;

    expect(res.register.token).toBeTruthy();
    newToken = res.register.token;

    expect(res.register.user.email).toEqual(REGISTER_EMAIL);
  });

  it("and check that the user got added to the db", async () => {
    new logger("purple", "checking that the user got added to the DB").genLog();
    const connection = await connectDb();
    const users = await User.find({ where: { email: REGISTER_EMAIL } });
    logJson(users);
    expect(users).toHaveLength(1);
    connection.close();
  });

  it("checks if we try to register with the same credentials it returns an error", async () => {
    new logger("purple", "trying to register the same user").genLog();
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    expect(res.register.errors).toHaveLength(1);
  });
});

describe("Tests the card resolvers adding, reading, editing, and deleting", () => {
  

  it("tries to add a card with a invalid token", async () => {
    //user not authenticated (bad token or no token)
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
    const invalidToken: AddCardResponse = await request(
      HOST + "/graphql",
      `${createAddCardMutation()}`,
      { options: addCardPayload.options },
      { "authorization": `Bearer adsfadfs` }
    );
    expect(invalidToken.addCard.errors).toHaveLength(1);
    expect(invalidToken.addCard.errors[0].message).toBe("401 user not authenticated");
  });

  it("tries to add a card with an expired token", async () => {
    //user not authenticated (bad token or no token)
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
    const invalidToken: AddCardResponse = await request(
      HOST + "/graphql",
      `${createAddCardMutation()}`,
      { options: addCardPayload.options },
      { "authorization": `Bearer ${EXPIRED_TOKEN}` }
    );
    expect(invalidToken.addCard.errors).toHaveLength(1);
    expect(invalidToken.addCard.errors[0].message).toBe("401 user not authenticated");
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
    expect(foundCard?.creatorId).toEqual(creatorId);
  });
    
    
});

describe("checks the getting cards mutation responses", () => {

  it("checks that the card is added to the DB by the creatorId that made the card", async () => {
    //make query for get card by id
    new logger("purple", "getting the card we just made from the id generated from the add card response").genLog();
    // card add auth only requestor can get their cards
    const res: GetUserCardsResponse = await request(
      HOST + "/graphql", `${createGetUserCardsQuery()}`,
      {},
      { "authorization": `Bearer ${newToken}` }
    );
    const foundCreatorCard = res.getUserCards.cards?.filter(card => card.creatorId === newUserId)[0];

    expect(res.getUserCards.cards).toHaveLength(1);
    expect(foundCreatorCard?.creatorId).toEqual(newUserId);
    expect(res.getUserCards.errors).toBeNull();
    expect(res.getUserCards.cards?.length).toBeTruthy();
    
  });
  
  it("checks the error messages are correct when not authenticated (not valid token)", async () => {
    new logger("purple", "checking for getting cards with invalid token");
    //check that the response
    const notFound: GetUserCardsResponse = await request(
      HOST + "/graphql",
      `${createGetUserCardsQuery()}`,
      {}, 
      { "authorization": `Bearer sdf` }
    );
    
    expect(notFound.getUserCards.errors).toHaveLength(1);
    expect(notFound.getUserCards.errors[0].message).toBe("401 Unauthenticated");
  });
  
  it("tries to get user cards with invalid token", async () => {
    //check that the response
    const invalidToken: GetUserCardsResponse = await request(
      HOST + "/graphql",
      `${createGetUserCardsQuery()}`,
      {}, 
      { "authorization": `Bearer asdfasdf` }
    );
    
    expect(invalidToken.getUserCards.errors).toHaveLength(1);
    expect(invalidToken.getUserCards.errors[0].message).toBe("401 Unauthenticated");
  });
  it("tries to get user cards with expired token", async () => {
    //check that the response
    const expired: GetUserCardsResponse = await request(
      HOST + "/graphql",
      `${createGetUserCardsQuery()}`,
      {}, 
      { "authorization": `Bearer ${EXPIRED_TOKEN}` }
    );
    
    expect(expired.getUserCards.errors).toHaveLength(1);
    expect(expired.getUserCards.errors[0].message).toBe("401 Unauthenticated");
  });
});


describe("checks editing a card", () => {
  describe("checks edit card access control logic", () => {
    it("tries to edit the card with an invalid token", async () => {
      const editCardPayload: EditCardPayload = {
        options: {
          id: newCardId,
          frontSideText: UPDATED_CARD_TEXT,
          frontSideLanguage: "TEST LANGUAGE",
          frontSidePicture: "PICTURE BASE 64 CRAP",
          backSideText: "BACKSIDE TEXT",
          backSideLanguage: "Backside language",
          backSidePicture: "whatever front side will be"
        }
      }
      const invalidToken: EditCardByIdResponse = await request(
        HOST + "/graphql", 
        `${createEditCardMutation()}`,
        { options: editCardPayload.options },
        { "authorization": `Bearer asdfasdfasdf`}
      );
      expect(invalidToken.editCardById.errors).toHaveLength(1);
      expect(invalidToken.editCardById.errors[0].message).toBe("401 Unauthenticated");
    });
    it("tries to edit the card with an expired token", async () => {
      const editCardPayload: EditCardPayload = {
        options: {
          id: newCardId,
          frontSideText: UPDATED_CARD_TEXT,
          frontSideLanguage: "TEST LANGUAGE",
          frontSidePicture: "PICTURE BASE 64 CRAP",
          backSideText: "BACKSIDE TEXT",
          backSideLanguage: "Backside language",
          backSidePicture: "whatever front side will be"
        }
      }
      const expiredToken: EditCardByIdResponse = await request(
        HOST + "/graphql", 
        `${createEditCardMutation()}`,
        { options: editCardPayload.options },
        { "authorization": `Bearer ${EXPIRED_TOKEN}`}
      );
      expect(expiredToken.editCardById.errors).toHaveLength(1);
      expect(expiredToken.editCardById.errors[0].message).toBe("401 Unauthenticated");
    });
    it("tries to edit the card with a not found cardId", async () => {
      const editCardPayload: EditCardPayload = {
        options: {
          id: 0, //shouldn't ever be zero unless we dropped the database and recreated it
          frontSideText: UPDATED_CARD_TEXT,
          frontSideLanguage: "TEST LANGUAGE",
          frontSidePicture: "PICTURE BASE 64 CRAP",
          backSideText: "BACKSIDE TEXT",
          backSideLanguage: "Backside language",
          backSidePicture: "whatever front side will be"
        }
      }
      const notFound: EditCardByIdResponse = await request(
        HOST + "/graphql", 
        `${createEditCardMutation()}`,
        { options: editCardPayload.options },
        { "authorization": `Bearer ${newToken}`}
      );
      expect(notFound.editCardById.errors).toHaveLength(1);
      expect(notFound.editCardById.errors[0].message).toBe("404 Card Not Found");
      
    });
  });
  
  it("edits the card that was just added", async () => {
    new logger("blue", "editing the card we just added").genLog();
    const editCardPayload: EditCardPayload = {
      options: {
        id: newCardId,
        frontSideText: UPDATED_CARD_TEXT,
        frontSideLanguage: "TEST LANGUAGE",
        frontSidePicture: "PICTURE BASE 64 CRAP",
        backSideText: "BACKSIDE TEXT",
        backSideLanguage: "Backside language",
        backSidePicture: "whatever front side will be"
      }
    }
    const res: EditCardByIdResponse = await request(
      HOST + "/graphql", 
      `${createEditCardMutation()}`,
      { options: editCardPayload.options },
      { "authorization": `Bearer ${newToken}`}
    );
    logJson(res.editCardById.cards);
    const foundEditedCardIndex = res.editCardById.cards?.findIndex((card: ICard) => card.id === newCardId);
    expect(res.editCardById.cards![foundEditedCardIndex as number].frontSideText).toEqual(UPDATED_CARD_TEXT);
  });
});

describe("deletes the cards", () => {

  it("tries to delete Cards with an invalid token", async () => {
    new logger("purple", "deleting the user's Cards that we made").genLog();  
    //malformed token test error
    const invalidToken: ClearUserCardsResponse = await request(
      HOST + "/graphql", 
      `${createClearUserCardsMutation()}`, 
      {},
      { "authorization": `Bearer al;kdjf;asfj` }
    );
    new logger("red", "should get expired error or unauthed because of a mangled, missing, or invalid token").genLog();
    expect(invalidToken.clearUserCards.errors).toHaveLength(1);
    expect(invalidToken.clearUserCards.errors[0].message).toBe("401 unauthorized or expired token");

  });

  it("tries to clear Cards with an expired token", async () => {
    //expired token test error
    const expiredToken: ClearUserCardsResponse = await request(
      HOST + "/graphql", 
      `${createClearUserCardsMutation()}`, 
      {},
      { "authorization": `Bearer ${EXPIRED_TOKEN}` }
    );
  
    new logger("red", "should get expired error or unauthed").genLog();
    expect(expiredToken.clearUserCards.errors).toHaveLength(1);
    expect(expiredToken.clearUserCards.errors[0].message).toBe("401 unauthorized or expired token");
  });
  
  it("should successfully clear cards", async () => {
    //delete the currently registered user's cards
    const successClear: ClearUserCardsResponse = await request(
      HOST + "/graphql", 
      `${createClearUserCardsMutation()}`,
      {},
      { "authorization": `Bearer ${newToken}` }
    );
    expect(successClear.clearUserCards.errors).toBeNull();
    expect(successClear.clearUserCards.done).toBe(true);
  });
});

describe("deletes the cards we just made and then deletes the user", () => {
  it("checks the user's cards to see if the deleted card is now missing", async () => {
    new logger("purple", "checking if the user's cards are gone").genLog();
    const res: GetUserCardsResponse = await request(
      HOST + "/graphql", 
      `${createGetUserCardsQuery()}`,
      {},
      { "authorization": `Bearer ${newToken}` }
    );
    expect(res.getUserCards.errors).toBeNull();
  
    //if this fails then something failed before we got here because we couldn't clear the cards before arriving here
    expect(res.getUserCards.cards).toHaveLength(0);
  });
  
  it("deletes the user", async () => {
    const connection = await connectDb();
    await User.delete({ email: REGISTER_EMAIL });
    const users = await User.find({ where: { email: REGISTER_EMAIL } });
    new logger("green", `deleting a user ${users}`).genLog();
    logJson(users);
    expect(users).toHaveLength(0);
    connection.close();
  });
});
