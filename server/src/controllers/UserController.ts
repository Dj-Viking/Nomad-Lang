/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Express, MyJwtData } from "../types";
import { Response } from "express";
import { CardClass, User } from "../models";
import { signToken } from "../utils/signToken";
import mongoose from "mongoose";
const uuid = require("uuid");
export const UserController = {
  me: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const user = await User.findOne({ email: req!.user!.email }).select("-password");
      const token = signToken({
        username: user!.username,
        email: user!.email,
        _id: user!._id,
        uuid: uuid.v4(),
      });
      const updated = await User.findOneAndUpdate({ email: user!.email }, { token }, { new: true })
        .select("-password")
        .select("-__v");

      return res.status(200).json({
        user: {
          username: updated!.username,
          email: updated!.email,
          _id: updated!._id,
          token,
          cards: updated!.cards,
        },
      });
    } catch (error) {}
  },
  login: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const { email, password } = req.body as MyJwtData;
      const user = await User.findOne({ email });
      if (user === null) return res.status(400).json({ error: "Incorrect Credentials" });
      const verifyPass = await user.isCorrectPassword(password);
      if (!verifyPass) return res.status(400).json({ error: "Incorrect Credentials" });
      const token = signToken({
        username: user.username,
        email: user.email,
        uuid: uuid.v4(),
      });
      const updated = await User.findOneAndUpdate(
        { _id: user._id },
        { token },
        { new: true }
      ).select("-__v");
      return res.status(200).json({
        user: {
          username: updated!.username,
          _id: updated!._id,
          token,
          cards: updated!.cards,
          email: updated!.email,
        },
      });
    } catch (error) {}
  },
  signup: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: "missing username email or password input!" });
      }
      const user = await User.create({
        username,
        email,
        password,
      });
      const token = signToken({
        username,
        email,
        uuid: uuid.v4(),
      });
      const updated = await User.findOneAndUpdate(
        {
          _id: user._id,
        },
        { token },
        { new: true }
      )
        .select("-password")
        .select("-__v");
      return res.status(201).json({
        user: {
          _id: updated!._id,
          username: updated!.username,
          email: updated!.email,
          token,
          cards: updated!.cards,
        },
      });
    } catch (error) {}
  },
  clearCards: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const user = await User.findOneAndUpdate(
        { email: req!.user!.email },
        {
          $set: {
            cards: [],
          },
        },
        { new: true }
      )
        .select("-password")
        .select("-__v");
      return res.status(200).json({ user });
    } catch (error) {}
  },
  editCard: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      const validId = mongoose.Types.ObjectId.isValid(id);
      if (!validId)
        return res
          .status(400)
          .json({ error: "Bad request, id parameter was not a valid id format" });
      let tempCard = {} as CardClass;
      let fieldCount = 0;
      for (let i = 0; i < Object.keys(req.body).length; i++) fieldCount++;
      if (fieldCount === 0)
        return res.status(400).json({
          error: "Need to provide fields to the json body that match a card's schema properties",
        });
      else void 0;
      // set up the tempCard object that will update the subdocument card of the user's cards subdoc array
      for (const key in req.body) {
        tempCard = {
          ...tempCard,
          [`cards.$.${key}`]: req.body[key],
        };
      }
      const updatedUser = await User.findOneAndUpdate(
        { email: req!.user!.email, "cards._id": id }, //find user's card subdocument by it's id from req.params
        {
          $set: { ...tempCard }, //update that card in the subdoc array that we found in the cards._id filter
        },
        { new: true }
      );
      return res.status(200).json({ cards: updatedUser!.cards });
    } catch (error) {}
  },
  deleteCard: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      const updatedUser = await User.findOneAndUpdate(
        { email: req!.user!.email, "cards._id": id },
        {
          $pull: {
            cards: { _id: id },
          },
        },
        { new: true }
      );
      if (updatedUser === null)
        return res.status(400).json({ error: "Could not delete a card at this time" });
      return res.status(200).json({ cards: updatedUser!.cards });
    } catch (error) {}
  },
  forgotPassword: async function (
    _req: Express.MyRequest,
    res: Response
  ): Promise<Response | void> {
    try {
      return res.status(200).json({ message: "found forgot password route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  changePassword: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: "found changePassword route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  addCard: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      // const user = await User.findOne({ email: req!.user!.email });
      const updatedUser = await User.findOneAndUpdate(
        { email: req!.user!.email },
        {
          $push: {
            cards: req.body,
          },
        },
        { new: true }
      )
        .select("-password")
        .select("-__v");

      return res.status(200).json({ cards: updatedUser!.cards });
    } catch (error) {}
  },
};
