/* eslint-disable */
import request from "supertest";
import mongoose from "mongoose";
import createServer from "../../app";
import { ChoiceClass } from "models";

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost/rest-cats-test", {});
});

afterAll(async () => {
    mongoose.connection.db.dropDatabase(async () => {
        await mongoose.connection.close();
    });
});
const app = createServer();


describe("test the chuck norris api choice getter thing", () => {
    test(" blah", async () => {
        const fake_choices_res = await request(app).get("/user/getFakeChoices");
        expect(fake_choices_res.status).toBe(200);
        const parsed = JSON.parse(fake_choices_res.text) as { message: string; data: ChoiceClass[] };
        expect(typeof parsed.message).toBe("string");
        expect(parsed.data).toHaveLength(3);
        // expect(parsed.data).toBe("kdfjdks");
    });
});