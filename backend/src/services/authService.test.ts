import { AuthService } from "./authService";
import { User } from "../models/User";
import { AppError } from "../middleware/error";

jest.mock("../models/User");

describe("AuthService", () => {
  const authService = new AuthService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      const mockUser = {
        _id: "user123",
        email: "test@example.com",
        roles: ["user"],
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.login("test@example.com", "password");

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(result.user.email).toBe("test@example.com");
    });

    it("should throw error for invalid email", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.login("invalid@example.com", "password")).rejects.toThrow(
        AppError
      );
    });

    it("should throw error for invalid password", async () => {
      const mockUser = {
        _id: "user123",
        email: "test@example.com",
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.login("test@example.com", "wrongpassword")).rejects.toThrow(
        AppError
      );
    });
  });

  describe("register", () => {
    it("should register new user successfully", async () => {
      const mockUser = {
        _id: "user123",
        email: "newuser@example.com",
        name: "New User",
        roles: ["user"],
        save: jest.fn(),
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User as unknown as jest.Mock).mockImplementation(() => mockUser);

      const result = await authService.register({
        name: "New User",
        email: "newuser@example.com",
        password: "password123",
      });

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(mockUser.save).toHaveBeenCalled();
    });

    it("should throw error if user already exists", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: "existing@example.com" });

      await expect(
        authService.register({
          name: "User",
          email: "existing@example.com",
          password: "password",
        })
      ).rejects.toThrow(AppError);
    });
  });
});
