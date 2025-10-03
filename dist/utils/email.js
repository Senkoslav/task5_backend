import nodemailer from 'nodemailer';
class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            connectionTimeout: 5000,
            greetingTimeout: 5000,
        });
    }
    async sendVerificationEmail(email, userId) {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('Email credentials not configured. Skipping email send.');
            return;
        }
        console.log(`Attempting to send email to: ${email}`);
        console.log(`Using SMTP: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);
        console.log(`From: ${process.env.EMAIL_FROM}`);
        const verificationLink = `${process.env.FRONTEND_URL}/verify/${userId}`;
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Email Verification - User Management System',
            html: `
                <h2>Email Verification</h2>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Verify Email
                </a>
                <p>If you didn't create this account, please ignore this email.</p>
            `,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email sent successfully to ${email}`);
            console.log(`Message ID: ${info.messageId}`);
            console.log(`Response: ${info.response}`);
        }
        catch (error) {
            console.error(`❌ Failed to send email to ${email}:`, error);
            console.warn(`User can still login without email verification.`);
        }
    }
}
export const emailService = new EmailService();
//# sourceMappingURL=email.js.map