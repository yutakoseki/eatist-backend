require("dotenv").config();
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Prisma初期化
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

// アップロード画像パス登録用API
router.post("/register", isAuthenticated, async (req, res) => {
    try {
        const newImage = await prisma.gallery.create({
            data: {
                title:req.body.title,
                imagename: req.body.imageName,
                uploadimagename: req.body.uploadImageName,
                filepath: req.body.urlPath,
                authorId: parseInt(req.body.userid),
            },
            include: {
                author: true,
            },
        });

        res.status(201).json(newImage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーです。" });
    }
});

// 画像取得用API
router.get("/get_latest_image", async (req, res) => {
    try {
        const latestImage = await prisma.gallery.findMany({
            where: {
                authorId: req.userid,
            },
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
                author: true,
            },
        });
        return res.json(latestImage);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "サーバーエラーです・" });
    }
});
module.exports = router;
