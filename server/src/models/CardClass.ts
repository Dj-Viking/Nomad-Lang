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
  public frontSideText?: string;

  @prop()
  public frontSideLanguage?: string;

  @prop()
  public frontSidePicture?: string;

  @prop()
  public backSideText?: string;

  @prop()
  public backSideLanguage?: string;

  @prop()
  public backSidePicture?: string;

  @prop()
  public creator?: string;

  @prop({ default: Date.now() })
  public createdAt: Date;

  @prop({ default: Date.now() })
  public updatedAt: Date;
}
