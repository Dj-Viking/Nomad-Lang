/* eslint-disable */
// import { Card } from "../../models";
// import mongoose from "mongoose";

// import {
//     Card,
//     User
// } from "../../models";

// beforeAll(async () => {
//     await mongoose.connect("mongodb://localhost/app-lang", {});
// });

// afterAll(async () => {
//     await mongoose.connection.close();
// });

// describe("can get viking", () => {
//     test(" update cards", async () => {
//         await Card.insertMany([{
//             "choices": [],
//             "frontSideText": "Bog",
//             "frontSideLanguage": "Croatian",
//             "frontSidePicture": "asfasdf",
//             "backSideText": "hello",
//             "creator": "viking",
//             "backSideLanguage": "English",
//             "backSidePicture": "",
//         },
//         {
//             "choices": [],
//             "frontSideText": "čeka!",
//             "frontSideLanguage": "Croatian",
//             "frontSidePicture": "",
//             "backSideText": "wait!",
//             "creator": "viking",
//             "backSideLanguage": "English",
//             "backSidePicture": "",
//         },
//         {
//             "choices": [],
//             "frontSideText": "razumijem",
//             "frontSideLanguage": "Hrvatski",
//             "frontSidePicture": "asdfadf",
//             "backSideText": "I understand",
//             "creator": "viking",
//             "backSideLanguage": "English",
//             "backSidePicture": "",
//         },
//         {
//             "choices": [],
//             "frontSideText": "Kraljevstvo",
//             "frontSideLanguage": "Croatian",
//             "frontSidePicture": "",
//             "backSideText": "Kingdom",
//             "creator": "viking",
//             "backSideLanguage": "English",
//             "backSidePicture": "",
//         },
//         {
//             "choices": [],
//             "frontSideText": "junak",
//             "frontSideLanguage": "Croatian",
//             "frontSidePicture": "",
//             "backSideText": "hero",
//             "creator": "viking",
//             "backSideLanguage": "English",
//             "backSidePicture": "",
//         },
//         {
//             "choices": [],
//             "frontSideText": "sdfasdfasdfasdf",
//             "frontSideLanguage": "",
//             "frontSidePicture": "",
//             "backSideText": "",
//             "creator": "viking",
//             "backSideLanguage": "",
//             "backSidePicture": "",
//         },
//         {
//             "choices": [],
//             "frontSideText": "а ты меня любишь?",
//             "frontSideLanguage": "Русский",
//             "frontSidePicture": "",
//             "backSideText": "do you love me?",
//             "creator": "viking",
//             "backSideLanguage": "English",
//             "backSidePicture": "",
//         }])
//     });
// });
// describe("placeholder", () => {
//     test("blah", async () => {
//         const cards = await Card.find({ creator: "viking" });

//         const updatePromises = cards.map(card => {
//             return Card.findOneAndUpdate(
//                 { _id: card._id.toHexString() },
//                 {
//                     $set: {
//                         choices: []
//                     },
//                 },
//                 { new: true },
//             );
//         });

//         const updated = await Promise.all(updatePromises);

//         await User.findOneAndUpdate({ username: "viking" }, {
//             $set: {
//                 cards: [...updated].map(card => card?._id.toHexString())
//             }
//         })
//     });
// });
describe("kdjfj", () => {
    test("kdfjd", () => {
        expect(true).toBe(true);
    })
})