export interface SmsProvider {
    sendSms(mobile: string, message: string): Promise<boolean>;
}

export class ConsoleSmsProvider implements SmsProvider {
    async sendSms(mobile: string, message: string): Promise<boolean> {
        console.log(`\n[SMS PROVIDER: CONSOLE]`);
        console.log(`To: ${mobile}`);
        console.log(`Message: ${message}`);
        console.log(`------------------------\n`);
        return true;
    }
}

// Add more providers here (e.g., TwilioProvider, etc.)

export function getSmsProvider(): SmsProvider {
    const providerType = process.env.SMS_PROVIDER || 'console';

    switch (providerType) {
        case 'console':
        default:
            return new ConsoleSmsProvider();
    }
}
