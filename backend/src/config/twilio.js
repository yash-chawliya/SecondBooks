import twilio from 'twilio';

let twilioClient;

export const getTwilioClient = () => {
    if (!twilioClient) {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        twilioClient = twilio(accountSid, authToken);
    }
    return twilioClient;
};

export const getVerifyServiceSid = () => process.env.TWILIO_VERIFY_SERVICE_SID;
