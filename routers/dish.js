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

// 店舗登録用API
router.post("/register", isAuthenticated, async (req, res) => {
    try {
        console.log(req.body);
        const newTask = await prisma.dish.create({
            data: {
                title: req.body.title,
                url: req.body.url,
                comment: req.body.comment,
                taskId: Number(req.body.taskId),
            },
        });

        res.status(201).json(newTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーです。" });
    }
});

// 店舗取得用API
router.get("/get_latest_list", async (req, res) => {
    const taskId = Number(req.query.taskId);
    if (isNaN(taskId)) {
        return res.status(400).json({ message: "無効なタスクIDです" });
    }

    try {
        const latestList = await prisma.dish.findMany({
            where: {
                taskId: taskId,
            },
            take: 10,
            orderBy: { createdAt: "desc" },
        });
        console.log(latestList);
        return res.json(latestList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーです" });
    }
});

// 店舗更新用API
router.post("/update", isAuthenticated, async (req, res) => {
    try {
        const newTask = await prisma.dish.update({
            where: {
                id: req.body.id,
            },
            data: {
                title: req.body.title,
                url: req.body.url,
                comment: req.body.comment,
            },
        });

        res.status(201).json(newTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーです。" });
    }
});

// 店舗削除用API
router.post("/delete", isAuthenticated, async (req, res) => {
    try {
        console.log(req.body);
        const newTask = await prisma.dish.delete({
            where: {
                id: req.body.id,
            },
        });

        res.status(201).json(newTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーです。" });
    }
});
module.exports = router;
