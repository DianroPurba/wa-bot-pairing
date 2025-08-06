const express = require("express");
const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

const app = express();
const PORT = process.env.PORT || 3000;

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("connection.update", (update) => {
        const { connection, qr } = update;
        if (qr) console.log("🔑 Scan QR berikut:\n", qr);
        if (connection === "open") console.log("✅ Bot berhasil login!");
    });
}

app.get("/", (req, res) => res.send("Bot aktif"));
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

startBot();