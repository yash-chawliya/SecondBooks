import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, default: 'New', enum: ['New', 'In Progress', 'Resolved'] }
}, { timestamps: true });

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
