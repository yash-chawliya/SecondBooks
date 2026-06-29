import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8);

const orderSchema = new mongoose.Schema({
  orderId: { type: String, default: () => nanoid(), unique: true, uppercase: true },
  userId: { type: String, required: true, index: true },
  orderBookId: { type: String, required: true },
  phone: { type: String, required: [true, 'User phone number is required.'], trim: true },
  itemAmount: { type: Number, required: [true, 'Item amount is required.'], min: 0 },
  paymentGatewayFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  amountPaid: { type: Number, default: 0 },
  paymentOption: { type: String, required: [true, 'Payment option is required.'] },
  shippingAddress: { type: String, required: true },
  expectedDeliveryDate: { type: String },
  orderStatus: { type: String, default: 'Pending' },
  razorpayPaymentId: { type: String },
  razorpayOrderId: { type: String }
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
