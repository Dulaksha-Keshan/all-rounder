import { Request, Response } from "express";
import mongoose from "mongoose";
import Notification from "../mongoose/notificationModel.js";

export const createNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipientId = req.headers["x-user-uid"] as string; 
    if (!recipientId) {
      res.status(400).json({ message: "x-user-uid header is required" });
      return;
    }

    const { title, message, type, relatedId } = req.body;

    if (!title || !message || !type) {
      res.status(400).json({ message: "title, message, and type are required" });
      return;
    }

    const notification = await Notification.create({
      title,
      message,
      type,
      recipient: recipientId,
      relatedId: relatedId ? relatedId : undefined,
    });

    res.status(201).json({
      message: "Notification created successfully",
      notification,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {};

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {};
