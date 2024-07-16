import express from "express";
import mongoose from "mongoose";
import router from "./routes/routes.js";
const app = express();

// middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", router);

const port = process.env.PORT || 7000;

app.get("*", (req, res) => {
  res.json("Not found");
});

app.listen(port, () => {
  mongoose
    .connect("mongodb://localhost:27017/sodiabackend", {
      useNewUrlParser: true,

      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("mongodb connect");
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(`server is running on port ${port}`);
});
