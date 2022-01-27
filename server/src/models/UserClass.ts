import { prop, pre, plugin, DocumentType, modelOptions } from "@typegoose/typegoose";
import { CardClass } from "./CardClass";
import argon2 from "argon2";
import mongooseUniqueValidator from "mongoose-unique-validator";

@modelOptions({
  schemaOptions: {
    collection: "users",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
})
@pre<UserClass>("save", async function (next) {
  if (this.isNew) this.password = await argon2.hash(this.password);
  next();
})
@plugin(mongooseUniqueValidator)
export class UserClass {
  @prop({ required: true, unique: true })
  public username!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop()
  public token?: string;

  @prop({ type: () => CardClass })
  public cards!: CardClass[]; // This is a typed Array

  @prop()
  public themePref?: string;

  @prop({ default: Date.now() })
  public createdAt: Date;

  @prop({ default: Date.now() })
  public updatedAt: Date;

  //important note, this method is not a part of the Model but the returned Document from a Model query
  // e.g. const user = User.findOne({ _id })
  // user.isCorrectPassword("password") //now the method is attached to the document
  public async isCorrectPassword(this: DocumentType<UserClass>, plainPass: string) {
    //returning the promise object unresolved and the await will happen when this method is called
    return argon2.verify(this.password, plainPass);
  }
}
