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

// タスク登録用API
router.post("/register", isAuthenticated, async (req, res) => {
    try {
        const newTask = await prisma.task.create({
            data: {
                text: req.body.text,
            },
        });

        res.status(201).json(newTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーです。" });
    }
});

// タスク取得用API
router.get("/get_latest_list", async (req, res) => {
    try {
        console.log("get_latest_list");
        const latestList = await prisma.task.findMany({
            where: {
                eatflag: false,
            },
            take: 10,
            orderBy: { createdAt: "desc" },
        });
        console.log(latestList);
        return res.json(latestList);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "サーバーエラーです・" });
    }
});

// タスク更新用API
router.post("/update", isAuthenticated, async (req, res) => {
    try {
        const newTask = await prisma.task.update({
            where: {
                id: req.body.id,
            },
            data: {
                text: req.body.text,
            },
        });

        res.status(201).json(newTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーです。" });
    }
});

// タスクチェック用API
router.post("/check", isAuthenticated, async (req, res) => {
    try {
        console.log("check",req.body);
        const newCheck = await prisma.task.update({
            where: {
                id: Number(req.body.id),
            },
            data: {
                eatflag: Boolean(req.body.eatflag),
            },
        });

        res.status(201).json(newCheck);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーです。" });
    }
});

// タスク削除用API
router.post("/delete", isAuthenticated, async (req, res) => {
    try {
        console.log(req.body);
        const newTask = await prisma.task.delete({
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

// タスクコンプリート用API
router.post("/complete", isAuthenticated, async (req, res) => {
    try {
        console.log("complete",req.body);
        const newComplete = await prisma.task.updateMany({
            data: {
                eatflag: Boolean(req.body.eatflag),
            },
        });

        res.status(201).json(newComplete);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーです。" });
    }
});