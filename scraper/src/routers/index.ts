import express from "express";
import restaurantRouter from "./restaurant";

const router = express.Router();

router.use("/menu", restaurantRouter);
router.get("/", (req, res) => {
  return res.send("Hello World");
});

export default router;
