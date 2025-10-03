declare class EmailService {
    private transporter;
    constructor();
    sendVerificationEmail(email: string, userId: number): Promise<void>;
}
export declare const emailService: EmailService;
export {};
