import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AppError } from "./error";

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        }));
        return next(new AppError(400, "Validation failed", errors));
      }

      req.body = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  password: Joi.string().min(8).required(),
});

export const createBookingSchema = Joi.object({
  userId: Joi.string().optional(),
  eventId: Joi.string().required(),
  scheduleDate: Joi.string().required(),
  tickets: Joi.array()
    .items(
      Joi.object({
        typeId: Joi.string().required(),
        qty: Joi.number().min(1).required(),
      })
    )
    .required(),
  contact: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  }).required(),
  currency: Joi.string().default("INR"),
});

export const createEventSchema = Joi.object({
  title: Joi.object().required(),
  slug: Joi.string().required(),
  description: Joi.object().required(),
  images: Joi.array().items(Joi.string().uri()).default([]),
  location: Joi.object({
    city: Joi.string().required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).required(),
  schedule: Joi.array()
    .items(
      Joi.object({
        date: Joi.string().required(),
        start: Joi.string().required(),
        end: Joi.string().required(),
        capacity: Joi.number().required(),
      })
    )
    .required(),
  ticketTypes: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        label: Joi.object().required(),
        price: Joi.number().required(),
        taxPercent: Joi.number().required(),
      })
    )
    .required(),
});

export const chatMessageSchema = Joi.object({
  sessionId: Joi.string().required(),
  userId: Joi.string().optional(),
  message: Joi.string().required(),
  language: Joi.string().default("en"),
});
