import { Request, Response } from "express";
import { z } from "zod";

const getRestaurantSchema = z.object({
  url: z.string().url(),
});

export const getRestaurantHandler = (req: Request, res: Response) => {
  try {
    const { url } = getRestaurantSchema.parse(req.body);
    return res.status(200).json({ url });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.issues });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
};
