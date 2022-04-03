/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Express, MyJwtData } from "../types";
import { Response } from "express";
import { CardClass, User } from "../models";
import { signToken } from "../utils/signToken";
import mongoose from "mongoose";
import { hash } from "argon2";
import { sendEmail } from "../utils/sendEmail";
import { APP_DOMAIN_PREFIX } from "../constants";
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
          themePref: updated!.themePref,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  login: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const { username, email, password } = req.body as MyJwtData;
      let user = null;
      if (username) {
        user = await User.findOne({ username });
      }
      if (email) {
        user = await User.findOne({ email });
      }
      if (user === null) return res.status(400).json({ error: "Incorrect Credentials" });
      const verifyPass = await user!.isCorrectPassword(password);
      if (!verifyPass) return res.status(400).json({ error: "Incorrect Credentials" });
      const token = signToken({
        username: user!.username,
        _id: user!._id.toHexString(),
        email: user!.email,
        uuid: uuid.v4(),
      });
      const updated = await User.findOneAndUpdate(
        { _id: user!._id },
        { token },
        { new: true }
      ).select("-__v");
      return res.status(200).json({
        username: updated!.username,
        _id: updated!._id,
        token: updated!.token,
        cards: updated!.cards,
        email: updated!.email,
        themePref: updated!.themePref,
      });
    } catch (error) {
      console.error(error);
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  },
  signup: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: "missing username, email, and/or password input!" });
      }

      const user = await User.create({
        username,
        email,
        password,
      });

      const token = signToken({
        username,
        email,
        _id: user!._id.toHexString(),
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
        _id: updated!._id,
        username: updated!.username,
        email: updated!.email,
        token: updated!.token,
        themePref: updated!.themePref,
        cards: updated!.cards,
      });
    } catch (error) {
      console.error(error);
      const err = error as Error;
      return res.status(500).json({ message: err.message });
    }
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
    } catch (error) {
      console.error(error);
    }
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
  forgotPassword: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const { email } = req.body;
      // if no email in body then error
      if (!email) return res.status(422).json({ error: "email missing from request!" });

      //if email isn't found just return done: true anyways
      const user = await User.findOne({ email });
      if (user === null) return res.status(200).json({ done: true });

      //send email if it's a valid email formatted string
      if (!emailRegex.test(email)) return res.status(200).json({ done: true });

      //create a reset email token
      const resetToken = signToken({
        username: user.username,
        resetEmail: email,
        uuid: uuid.v4(),
        exp: "5m",
      });

      //if user is not null then send the email
      const sendEmailArgs = {
        fromHeader: "Password Reset",
        subject: "Password Reset Request",
        mailTo: email,
        mailHtml: `
          <span>We were made aware that you request your password to be reset</span>
          <p>If this wasn't you. Then please disregard this email. Thank you!</p>
          <h2>This Request will expire after 5 minutes.</h2>
          <a href="${APP_DOMAIN_PREFIX}/changepass/${resetToken}">Reset your password</a>
        `,
      };

      await sendEmail(sendEmailArgs);

      return res.status(200).json({ done: true });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "We're sorry there was a problem with this request :(" });
      // return res.status(500).json({ error: error.message });
    }
  },
  changePassword: async function (req: Express.MyRequest, res: Response): Promise<Response> {
    // console.log("email from token", req!.user!.resetEmail);
    try {
      const { newPassword } = req.body;
      if (!newPassword) return res.status(400).json({ error: "missing password input" });

      const hashed = await hash(newPassword);

      const token = signToken({
        username: req!.user!.username,
        email: req!.user!.resetEmail as string,
        uuid: uuid.v4(),
      });

      const user = await User.findOneAndUpdate(
        { email: req!.user!.resetEmail },
        {
          $set: {
            password: hashed,
            token,
          },
        },
        { new: true }
      );

      return res.status(200).json({
        cards: user!.cards,
        done: true,
        token: user!.token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  addCard: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { email: req!.user!.email },
        {
          $push: {
            cards: { ...req.body },
          },
        },
        { new: true }
      )
        .select("-password")
        .select("-__v");

      return res.status(200).json({ cards: updatedUser!.cards });
    } catch (error) {
      console.error(error);
    }
  },
  changeThemePref: async function (
    req: Express.MyRequest,
    res: Response
  ): Promise<Response | void> {
    try {
      const { themePref } = req.body;
      const updated = await User.findOneAndUpdate(
        { email: req!.user!.email },
        {
          $set: {
            themePref,
          },
        },
        { new: true }
      );

      if (updated === null) return res.status(404).json({ error: "user not found" });
      return res.status(200).json({
        themePref: updated!.themePref,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "error while changing theme preference" });
    }
  },
};
