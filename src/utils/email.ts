import nodemailer from 'nodemailer';

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_PORT === '465', // true для порта 465, false для 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            connectionTimeout: 60000, // 60 секунд
            greetingTimeout: 30000,   // 30 секунд
            socketTimeout: 60000,     // 60 секунд
        });
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log('✅ SMTP connection verified successfully');
            return true;
        } catch (error) {
            console.error('❌ SMTP connection failed:', error);
            return false;
        }
    }

    async sendVerificationEmail(email: string, userId: number): Promise<void> {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️ Email credentials not configured. Skipping email send.');
            return;
        }

        console.log(`📧 Attempting to send email to: ${email}`);
        console.log(`🔧 Using SMTP: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);
        console.log(`📤 From: ${process.env.EMAIL_FROM}`);
        console.log(`🔒 Secure: ${process.env.EMAIL_PORT === '465'}`);

        // Проверяем соединение перед отправкой
        const isConnected = await this.testConnection();
        if (!isConnected) {
            console.error('❌ Cannot establish SMTP connection. Email will not be sent.');
            console.warn('💡 Suggestion: Try using Mailtrap or SendGrid instead of Gmail on hosting platforms.');
            return;
        }

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
            console.log(`Email sent successfully to ${email}`);
            console.log(`Message ID: ${info.messageId}`);
            console.log(`Response: ${info.response}`);
        } catch (error) {
            console.error(`Failed to send email to ${email}:`, error);
            console.warn(`User can still login without email verification.`);
            
            // Дополнительная диагностика
            if (error.code === 'ETIMEDOUT') {
                console.error('Connection timeout - hosting provider may be blocking SMTP connections');
                console.log('💡 Try using SendGrid, Mailtrap, or another email service');
            }
        }
    }
}

export const emailService = new EmailService();