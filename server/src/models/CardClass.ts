import { prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    collection: "cards",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
})
export class CardClass {
  @prop()
  public frontsideText?: string;

  @prop()
  public frontsideLanguage?: string;

  @prop()
  public frontsidePicture?: string;

  @prop()
  public backsideText?: string;

  @prop()
  public backsideLanguage?: string;

  @prop()
  public backsidePicture?: string;

  @prop()
  public creator?: string;

  @prop({ default: Date.now() })
  public createdAt: Date;

  @prop({ default: Date.now() })
  public updatedAt: Date;
}
