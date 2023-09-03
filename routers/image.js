require("dotenv").config();
const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");



// 呟き投稿用API
router.post("/image", isAuthenticated, async (req, res) => {
    try {
        const { url, method, data, headers } = req.body;

        const response = await axios({
            method,
            url,
            data,
            headers,
        });

        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { message: "An error occurred" });
    }
});

module.exports = router;
