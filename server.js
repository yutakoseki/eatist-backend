require("dotenv").config();
const express = require("express");
const app = express();
const authRoute = require("./routers/auth");
const postsRoute = require("./routers/posts");
const usersRoute = require("./routers/users");
const imageRoute = require("./routers/image");
const galleryRoute = require("./routers/gallery");
const listRoute = require("./routers/list");
const dishRoute = require("./routers/dish");
const cors = require("cors");

// PORTは適当
const PORT = 5055;

// TODO Getテスト用
// app.get("/", (req, res) => {
//     res.send("<h1>Hello world</h1>");
// })

// TODO Postテスト用

// Expressの設定
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/users", usersRoute);
app.use("/api/image", imageRoute);
app.use("/api/gallery", galleryRoute);
app.use("/api/list", listRoute);
app.use("/api/dish", dishRoute);

app.listen(PORT, () => console.log(`sercer is running on Port ${PORT}`));
