import express, { Application } from "express";

const app: Application = express();

app.use(express.json());

app.use("/", (req, res, next) => {
  return res.status(200).json({ msg: "Hello From Product" });
});

app.listen(8002, () => {
  console.log("Product Microservice Listening to Port 8001");
});
