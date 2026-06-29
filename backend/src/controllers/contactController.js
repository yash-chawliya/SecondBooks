import Enquiry from '../models/Enquiry.js';

export const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newEnquiry = new Enquiry({
            name,
            email,
            subject,
            message
        });

        await newEnquiry.save();

        res.status(201).json({ message: 'Your message has been received! We will get back to you shortly.' });

    } catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({ message: 'An error occurred on the server. Please try again later.' });
    }
};
