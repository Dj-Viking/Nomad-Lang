/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Express, MyJwtData } from "../types";
import { Response } from "express";
import { User } from "../models";
import { signToken } from "../utils/signToken";
const uuid = require("uuid");
export const UserController = {
  me: async function (req: Express.MyRequest, res: Response): Promise<Response> {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
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
  getUserCards: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: "found getusercards route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  getCategorizedCards: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: "found getusercards route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  clearCards: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: "found clear cards route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  editCard: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: "found editcard route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  deleteOneCard: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: "found delete one card route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  forgotPassword: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
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
};
