import request from "supertest";
import express from "express";
import authRoutes from "./authRoutes";
import { User } from "../models/User";

jest.mock("../models/User");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("Auth Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/login", () => {
    it("should login successfully", async () => {
      const mockUser = {
        _id: "user123",
        email: "test@example.com",
        name: "Test User",
        roles: ["user"],
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
    });

    it("should return 400 for missing email", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ password: "password123" });

      expect(response.status).toBe(400);
    });

    it("should return 401 for invalid credentials", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/auth/login")
        .send({ email: "invalid@example.com", password: "password" });

      expect(response.status).toBe(401);
    });
  });

  describe("POST /auth/register", () => {
    it("should register successfully", async () => {
      const mockUser = {
        _id: "user123",
        email: "newuser@example.com",
        name: "New User",
        roles: ["user"],
        save: jest.fn(),
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User as unknown as jest.Mock).mockImplementation(() => mockUser);

      const response = await request(app)
        .post("/auth/register")
        .send({
          name: "New User",
          email: "newuser@example.com",
          password: "password123",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
    });

    it("should return 400 if user already exists", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        email: "existing@example.com",
      });

      const response = await request(app)
        .post("/auth/register")
        .send({
          name: "User",
          email: "existing@example.com",
          password: "password123",
        });

      expect(response.status).toBe(400);
    });
  });
});
