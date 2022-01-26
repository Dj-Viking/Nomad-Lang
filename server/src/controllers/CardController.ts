import { Response } from "express";
import { Express } from "../types";
export const CardController = {
  getAllUserCards: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: " found get all cards route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  editCard: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: " found get all cards route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  getCategorizedCards: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: " found get all cards route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  deleteOneCard: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: " found get all cards route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  getOneCard: async function (_req: Express.MyRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: " found get all cards route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
};
