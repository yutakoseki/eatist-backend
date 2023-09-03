const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Prisma初期化
const prisma = new PrismaClient();

router.get("/find", isAuthenticated, async (req, res) => {
    try {
        const user = await prisma.user.findMany({
            where: {
                id: req.userid,
            },
        });

        if (!user) {
            req.status(404).json({ error: "ユーザーが見つかりませんでした。" });
        }

        console.log(user);

        res.status(200).json({
            user: { id: user.id, username: user.username, email: user.email },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

router.get("/profile/:userId", async (req, res) => {
    // urlのパラメーターからIDを取得
    const { userId } = req.params;

    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: parseInt(userId) },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!profile) {
            return res.status(404).json({ message: "プロフィールが見つかりませんでした。" });
        }
        res.status(200).json(profile);
    } catch (err) {
        console.log(err);
        return res.status(404).json({ error: err.message });
    }
});

module.exports = router;
