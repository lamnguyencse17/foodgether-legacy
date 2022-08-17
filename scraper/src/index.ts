import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import router from "./routers";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
if (!port) {
  throw new Error("PORT environment variable is not set");
}

app.use(bodyParser.json());

app.use("/", router);

app.listen(port, () => {
  console.log(`[server]: Server is running at port ${port}`);
});
