import { Router, Request, Response, NextFunction } from "express";
import { EventService } from "../services/eventService";
import { authMiddleware, adminMiddleware } from "../middleware/auth";
import { AppError } from "../middleware/error";

const router = Router();
const eventService = new EventService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city, date, q, page, limit } = req.query;
    const result = await eventService.listEvents({
      city: city as string,
      date: date as string,
      q: q as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.getEventBySlug(req.params.slug);
    res.json(event);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await eventService.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await eventService.updateEvent(req.params.id, req.body);
      res.json(event);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await eventService.deleteEvent(req.params.id);
      res.json({ message: "Event deleted" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
