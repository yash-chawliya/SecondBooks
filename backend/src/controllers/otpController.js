import { getTwilioClient, getVerifyServiceSid } from '../config/twilio.js';

export const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required.' });
  }

  try {
    const client = getTwilioClient();
    const verifyServiceSid = getVerifyServiceSid();
    
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });

    console.log('Verification SID:', verification.sid);
    res.status(200).json({ success: true, message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP.', error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, message: 'Phone number and OTP are required.' });
  }

  try {
    const client = getTwilioClient();
    const verifyServiceSid = getVerifyServiceSid();

    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({ to: phoneNumber, code: otp });

    if (verificationCheck.status === 'approved') {
      res.status(200).json({ success: true, message: 'OTP verified successfully!' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP.', error: error.message });
  }
};
