declare class EmailService {
    private transporter;
    constructor();
    testConnection(): Promise<boolean>;
    sendVerificationEmail(email: string, userId: number): Promise<void>;
}
export declare const emailService: EmailService;
export {};
