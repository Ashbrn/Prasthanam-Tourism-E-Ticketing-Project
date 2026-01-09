import { User } from "../models/User";
import { generateTokens } from "../utils/jwt";
import { AppError } from "../middleware/error";

export class AuthService {
  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const isPasswordValid = await (user as any).comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError(401, "Invalid email or password");
    }

    const payload = {
      userId: user._id!.toString(),
      email: user.email,
      roles: user.roles,
    };

    const tokens = generateTokens(payload);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage,
        roles: user.roles,
      },
    };
  }

  async register(data: { name: string; email: string; password: string; phone?: string }) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError(400, "User already exists");
    }

    const user = new User({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      preferredLanguage: "en",
      roles: ["user"],
    });

    await user.save();

    const payload = {
      userId: user._id!.toString(),
      email: user.email,
      roles: user.roles,
    };

    const tokens = generateTokens(payload);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage,
        roles: user.roles,
      },
    };
  }

  async getUserById(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return user;
  }
}
