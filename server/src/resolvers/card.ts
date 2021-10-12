import { Card } from '../entities/Card';
import { User } from '../entities/User';
import { 
  Resolver, 
  Query, 
  Mutation,
  // ObjectType,
  Field,
  // InputType,
  Arg,
  ObjectType,
  Ctx,
  Int,
  InputType
} from 'type-graphql';
import { DeleteResult, getConnection } from 'typeorm';
import { ANSI_ESCAPES, MyContext } from '../types';
import { ErrorResponse } from '../utils/ErrorResponse';

@ObjectType()
class CardError {
  @Field()
  field: String;
  @Field()
  message: String; 
}

@ObjectType()

class DeleteCardResponse {
  @Field(() => [CardError], { nullable: true })
  errors?: CardError[] | null

  @Field(() => [Card], { nullable: true })
  cards?: Card[] | null
}
@ObjectType()
class ClearCardResponse {
  @Field(() => [CardError], { nullable: true })
  errors?: CardError[] | null

  @Field(() => Boolean, { nullable: true })
  done: boolean | null;
}

@ObjectType()
@InputType()
class AddCardInput {
  
  @Field(() => String, { nullable: true })
  frontSideText: string;
  
  @Field(() => String, { nullable: true })
  frontSideLanguage: string;
  
  @Field(() => String, { nullable: true })
  frontSidePicture: string;
  
  @Field(() => String, { nullable: true })
  backSideText: string;
  
  @Field(() => String, { nullable: true })
  backSideLanguage: string;

  @Field(() => String, { nullable: true })
  backSidePicture: string;

}
@ObjectType()
@InputType()
class EditCardInput {
  
  @Field(() => Int, { nullable: true })
  id: string;
  
  @Field(() => String, { nullable: true })
  frontSideText: string;
  
  @Field(() => String, { nullable: true })
  frontSideLanguage: string;
  
  @Field(() => String, { nullable: true })
  frontSidePicture: string;
  
  @Field(() => String, { nullable: true })
  backSideText: string;
  
  @Field(() => String, { nullable: true })
  backSideLanguage: string;
  
  @Field(() => String, { nullable: true })
  backSidePicture: string;
}
@ObjectType()
class AddCardResponse {
  @Field(() => [CardError], { nullable: true })
  errors?: CardError[] | null

  @Field(() => [Card], { nullable: true })
  cards?: Card[] | null
}
@ObjectType()
class EditCardResponse {
  @Field(() => [CardError], { nullable: true })
  errors?: CardError[] | null

  @Field(() => [Card], { nullable: true })
  cards?: Card[] | null
}
@ObjectType()
class GetUserCardsResponse {
  @Field(() => [CardError], { nullable: true })
  errors?: CardError[] | null

  @Field(() => [Card], { nullable: true })
  cards?: Card[] | null
}

@Resolver()
export class CardResolver {

  @Query(() => String)
  async helloCard(): Promise<string>{
    return "hello CARD"
  }

  @Query(() => GetUserCardsResponse)
  async getUserCards(
    @Ctx() { req }: MyContext
  ): Promise<GetUserCardsResponse> {
    /// if requestor is not authorized to get the cards with their requestor ID not authorized
  if (!req.user) {
    return new ErrorResponse("unauthenticated", "401 Unauthenticated");
  }
  console.log("req checking req.user", req.user);
  
  //get the requestors email and compare with the creatorId owner's email (emails are unique)
  const foundUserByEmail = await User.findOne({ where: { email: req.user.email } });
  if (!foundUserByEmail) {
    return new ErrorResponse("not found", "404 Not Found");
  }

  //does the creator Id match that of the requestor's? 
  if (foundUserByEmail?.email !== req.user.email) {
    return new ErrorResponse("forbidden", "403 Forbidden");
  }

    try {
      const cards = await Card.find({ where: { creatorId: foundUserByEmail.id }});
      console.log("checking cards given the creatorId", cards);
      return {
        cards: cards
      };
    } catch (error) {
      return new ErrorResponse("error", error.message)
    }
  }

  @Mutation(() => EditCardResponse)
  async editCardById(
    @Arg("options", () => EditCardInput) options: EditCardInput,
    @Ctx() { req }: MyContext
  ): Promise<EditCardResponse> {

    const { id, frontSideText, backSideLanguage, backSideText, frontSideLanguage, frontSidePicture } = options;

    if (!req.user) {
      return new ErrorResponse("unauthenticated", "401 Unauthenticated");
    }
    console.log("req checking req.user", req.user);
    
    //get the requestors email and compare with the creatorId owner's email (emails are unique)
    const foundUserByEmail = await User.findOne({ where: { email: req.user.email } });
    if (!foundUserByEmail) {
      return new ErrorResponse("not found", "404 Not Found");
    }
  
    //does the editor's email match that of the requestor's email? 
    if (foundUserByEmail?.email !== req.user.email) {
      return new ErrorResponse("forbidden", "403 Forbidden");
    }

    try {
      const changedCard = await getConnection()
        .getRepository(Card)
        .createQueryBuilder("card")
        .update<Card>(Card, 
                      { frontSideText,
                        frontSidePicture,
                        frontSideLanguage, 
                        backSideText,
                        backSideLanguage, 
                        backSidePicture: frontSidePicture, })
        .where("id = :id", { id })
        .returning(["frontSideText", "frontSidePicture", "frontSideLanguage", "backsideText", "id", "creatorId", "createdAt", "updatedAt"])
        .updateEntity(true)
        .execute();
      if (!changedCard.raw[0]) return new ErrorResponse("card", "404 Card Not Found");

      const cards = await Card.find({ where: { creatorId: foundUserByEmail.id } });

      console.log('cards of the person editing a card', cards);

      return {
        cards: cards
      }
      
    } catch (error) {
      return new ErrorResponse("error when editing a card", error);
    }
  }

  @Mutation(() => DeleteCardResponse)
  async deleteCard(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<DeleteCardResponse | ErrorResponse> {
    if (!req.user) {
      return new ErrorResponse("unauthorized", "401 unauthorized");
    }

    try {
      const result = await Card.delete<Card>(id);

      console.log("delete result", result);
      //returns { raw: [], affected: 1 } affected 1 if the operation affected an entity
      
      const user = await User.findOne({ where: { email: req.user.email } });
      const cards = await Card.find({ where: { creatorId: user?.id } });

      return {
        cards: cards
      }

    } catch (error) {
      return new ErrorResponse("error when deleting a card", error);
    }
  }

  @Mutation(() => ClearCardResponse)
  async clearUserCards(
    @Ctx() { req }: MyContext
  ): Promise<ClearCardResponse | ErrorResponse> {

    //cant delete if not authorized or even the user who is logged in trying to complete this operation
    if (!req.user) return new ErrorResponse("unauthorized", "401 unauthorized or expired token");
    
    console.log("req.user", req.user);

    //the requestor is not the owner of the cards using email since emails are unique per user
    // and the requestor is embedded into the jwt information
    const foundUserByEmail = await User.findOne({ where: { email: req.user.email }});

    //if no user RETURN error not throw, this is for testing the correct responses
    // because graphql will only return 200's for most everything even if the request is formatted correctly
    // we are checking for data integrity and user honesty
    if (!foundUserByEmail) return new ErrorResponse("not found", "404 Not Found");

    //if user was found with email in request but does not match the requestor's email
    if (req.user?.email !== foundUserByEmail.email) return new ErrorResponse("forbidden", "403 Forbidden");

    try {
      //get all cards by the requestor's id that we found by the email input
      const cardsToDelete = await Card.find({ where: { creatorId: foundUserByEmail.id }});
      const deletePromises = cardsToDelete.map(async (card: Card) => {
        return Card.delete(card.id);
      });
      await Promise.all<DeleteResult>(deletePromises);
      return {
        done: true
      }
    } catch (error) {
      return new ErrorResponse("error", error.message);
    }
  }

  @Mutation(() => AddCardResponse)
  async addCard(
    @Arg("options", () => AddCardInput) options: AddCardInput,
    @Ctx() { req }: MyContext
  ): Promise<AddCardResponse | ErrorResponse> {

    const { backSideLanguage, frontSideText, backSideText, frontSideLanguage, frontSidePicture } = options;

    console.log("options input on add card", options)

    if (!req.user) {
      return new ErrorResponse("unauthenticated", "401 user not authenticated");
    }
    const foundUserByEmail: User | undefined = await User.findOne({ where: { email: req.user.email }});
    if (!foundUserByEmail) 
      return new ErrorResponse("not found", "404 Not Found");

    if (foundUserByEmail.email !== req.user.email)
      return new ErrorResponse("forbidden", "403 Forbidden");

    try {
      await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Card)
      .values({ frontSideText,
                frontSideLanguage,
                frontSidePicture,
                backSideText,
                backSideLanguage,
                backSidePicture: frontSidePicture,
                //a creator with this id MUST exist for this query to work!!
                creatorId: foundUserByEmail?.id })
      .returning(["frontSideText", "frontSidePicture", "frontSideLanguage", "backsideText", "id", "creatorId", "createdAt", "updatedAt"])
      .execute();
      //seeing all the cards that the user has
      const cards = await Card.find({ where: { creatorId: foundUserByEmail?.id } });
      console.log(`${ANSI_ESCAPES.success}`, `Someone added a card!`, `${ANSI_ESCAPES.reset}`);
      console.log("heres new set of flashcards", cards);
      return {
        cards: cards
      };
    } catch (error) {
      return new ErrorResponse("error", error.message)
    }
    
  }
  
}