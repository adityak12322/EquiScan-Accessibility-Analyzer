// server/utils/emailUtils.js

import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

// Transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // Agar Gmail use kar rahe ho
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (options) => {
    const mailOptions = {
        from: `EquiScan Support <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    };

    await transporter.sendMail(mailOptions);
};