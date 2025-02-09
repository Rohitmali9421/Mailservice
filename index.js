require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-location", async (req, res) => {
    const { latitude, longitude } = req.body;
    console.log(latitude, longitude)
    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Invalid location data" });
    }

    const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.PASSWORD,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: "rsm9421@gmail.com",  
        subject: "Live Location",
        text: `Hey, here is the current location: ${locationLink}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Email sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send email" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
