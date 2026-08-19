"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = async (to, subject, htmlContent) => {
    try {
        let transporter;
        // Use SMTP environment variables if provided
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            transporter = nodemailer_1.default.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || "587"),
                secure: process.env.SMTP_SECURE === "true",
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        }
        else {
            // Fallback: Create test credentials on ethereal.email
            const testAccount = await nodemailer_1.default.createTestAccount();
            transporter = nodemailer_1.default.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        }
        const mailOptions = {
            from: process.env.SMTP_USER
                ? `"CipherGPT" <${process.env.SMTP_USER}>`
                : `"CipherGPT Security" <security@ciphergpt.com>`,
            to,
            subject,
            html: htmlContent,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Mail Send] Message sent to ${to}: ${info.messageId}`);
        // If using Ethereal, print preview URL to logs
        if (!process.env.SMTP_HOST) {
            console.log(`[Mail Preview] URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
        }
        return info;
    }
    catch (error) {
        console.error("[Mail Error] Failed to send email:", error);
        throw new Error("Could not send verification email");
    }
};
exports.sendMail = sendMail;
//# sourceMappingURL=mail-sender.js.map