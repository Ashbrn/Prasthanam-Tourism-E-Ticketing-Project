import { Router, Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { authMiddleware } from "../middleware/auth";
import { AppError } from "../middleware/error";
import { verifyRefreshToken, generateTokens } from "../utils/jwt";

const router = Router();
const authService = new AuthService();

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, "Email and password are required");
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      throw new AppError(400, "Name, email, and password are required");
    }

    const result = await authService.register({ name, email, password, phone });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError(400, "Refresh token is required");
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new AppError(401, "Invalid refresh token");
    }

    const authService_inst = new AuthService();
    const user = await authService_inst.getUserById(decoded.userId);

    const tokens = generateTokens({
      userId: user._id!.toString(),
      email: user.email,
      roles: user.roles,
    });

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    const authService_inst = new AuthService();
    const user = await authService_inst.getUserById(req.user.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
