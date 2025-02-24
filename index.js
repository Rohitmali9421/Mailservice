require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-location", async (req, res) => {
    const { latitude, longitude, email } = req.body;

    if (!latitude || !longitude || !email) {
        return res.status(400).json({ error: "Invalid request. Latitude, longitude, and email are required." });
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
        from: `"Location Tracker" <${process.env.EMAIL}>`, // Custom sender name
        to: email,  // Dynamic email from request body
        subject: "Emergency Alert: Live Location Update",
        text: `Urgent! The current location has been shared for safety purposes: ${locationLink}`,
        html: `<p><strong>Emergency Alert:</strong></p>
       <p>The live location has been shared for safety purposes.</p>
       <p><strong>Location:</strong> <a href="${locationLink}">${locationLink}</a></p>
       <p>Please take necessary action if needed.</p>`

    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: `Email sent successfully to ${email}!` });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
