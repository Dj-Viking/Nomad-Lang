import { UserClass } from "./UserClass";
import { CardClass } from "./CardClass";
import { getModelForClass } from "@typegoose/typegoose";

const User = getModelForClass(UserClass);

export { CardClass, User };
