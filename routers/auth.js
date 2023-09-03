require("dotenv").config();
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateIdenticon = require("../utils/generateIdenticon");

// Prisma初期化
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

// 新規ユーザー登録API
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    // デフォルト画像
    const defaultIconImage = generateIdenticon(email);

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            profile: {
                create: {
                    bio: "はじめまして",
                    profileImageUrl: defaultIconImage,
                },
            },
        },
        include: {
            profile: true,
        },
    });
    return res.json({ user });
});

// ユーザーログインAPI
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // emailからユーザーを探す
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ error: "ユーザーが存在しません" });
    }

    // パスワードを検証
    const isPasswordVaild = await bcrypt.compare(password, user.password);
    if (!isPasswordVaild) {
        return res.status(401).json({ error: "パスワードが正しくありません" });
    }

    // JWTトークンを生成
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: "1d", // 1日有効
    });
    // クライアント側に返す
    return res.json({ token });
});

module.exports = router;
