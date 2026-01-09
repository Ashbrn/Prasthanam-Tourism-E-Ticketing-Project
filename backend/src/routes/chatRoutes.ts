import { Router, Request, Response, NextFunction } from "express";
import { ChatbotService } from "../services/chatbotService";
import { AppError } from "../middleware/error";

const router = Router();
const chatbotService = new ChatbotService();

router.post("/message", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, userId, message, language } = req.body;

    if (!sessionId || !message) {
      throw new AppError(400, "sessionId and message are required");
    }

    const reply = await chatbotService.processMessage({
      sessionId,
      userId,
      message,
      language: language || "en",
    });

    res.json(reply);
  } catch (error) {
    next(error);
  }
});

export default router;
