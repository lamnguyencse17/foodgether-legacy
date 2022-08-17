import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import router from "./routers";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
if (!port) {
  throw new Error("PORT environment variable is not set");
}

app.use(bodyParser.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        callback(new Error("No Origin"));
      } else {
        if (origin.includes("localhost") || origin.includes("foodgether")) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
  })
);

app.use("/", router);

app.listen(port, () => {
  console.log(`[server]: Server is running at port ${port}`);
});
