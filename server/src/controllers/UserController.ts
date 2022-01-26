import { Express } from "../types";
import { Response } from "express";
export const UserController = {
  login: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: "found login route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  signup: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: "found signup route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
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
      return res.status(200).json({ message: "found getusercards route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  editCard: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: "found getusercards route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  deleteOneCard: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: "found getusercards route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
};
