import { Request, Response } from "express";
import { z } from "zod";
import { scrapeRestaurant } from "../scraper";

const getRestaurantSchema = z.object({
  url: z.string().url(),
});

export const getRestaurantHandler = async (req: Request, res: Response) => {
  try {
    const { url } = getRestaurantSchema.parse(req.body);
    const result = await scrapeRestaurant(url);
    return res.status(200).json({ ...result });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.issues });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
};
