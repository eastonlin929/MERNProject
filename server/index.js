const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
//因為passport.js exports是函數，所以可以直接執行
const cors = require("cors");
//Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/newMernDB")
  .then(() => {
    console.log("Connecting to mongoDB...");
  })
  .catch((e) => {
    console.log(e);
  });

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extend: true }));
app.use(cors());
app.use("/api/user", authRoute);
//course應該被jwt保護
//如果request header內部沒有jwt，則request會被視為未授權的請求
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);
//只有登入系統的人，才能新增或註冊課程
//需通過驗證的人手上都會有jwt
//react預設使用3000，所以要錯開
app.listen(8080, () => {
  console.log("後端伺服器在port 8080上運行...");
});
