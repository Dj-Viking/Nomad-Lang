/* eslint-disable */
import { prop, modelOptions } from "@typegoose/typegoose";
@modelOptions({
    schemaOptions: {
        collection: "choices",
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    },
})
export class ChoiceClass {
    @prop({ type: () => String, default: "nothing yet" })
    text: string;
}
