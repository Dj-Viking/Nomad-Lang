import { UserClass } from "./UserClass";
import { CardClass } from "./CardClass";
import { ChoiceClass } from "./ChoiceClass";
import { getModelForClass } from "@typegoose/typegoose";

const User = getModelForClass(UserClass);
const Card = getModelForClass(CardClass);

export { Card, User, CardClass, UserClass, ChoiceClass };
