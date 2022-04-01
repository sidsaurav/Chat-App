const express = require("express");
const dotenv = require("dotenv");
const chats = require("../backend/data/data");
const connectDB = require("./config/db");
const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
connectDB();

app.get("/api/chats", (req, res) => {
    // console.log(chats);
    res.send(chats);
});

app.get("/api/chats/:id", (req, res) => {
    const id = req.params.id;
    let data = "";
    chats.forEach((obj) => {
        if (obj._id == id) {
            data = obj.chatName;
        }
    });
    res.send(data);
});
