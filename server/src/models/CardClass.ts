import { prop, modelOptions, mongoose } from "@typegoose/typegoose";

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
  public _id: mongoose.Types.ObjectId;

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
