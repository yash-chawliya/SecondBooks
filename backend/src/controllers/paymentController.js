import crypto from 'crypto';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Book from '../models/Book.js';
import { getRazorpayInstance } from '../config/razorpay.js';
import { getMailTransporter } from '../config/mail.js';

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: amount,
      currency,
      receipt: `receipt_order_${new Date().getTime()}`
    };

    const razorpayInstance = getRazorpayInstance();
    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(500).send("Error creating Razorpay order");
    }

    res.json(order);
  } catch (error) {
    console.error("Error in /api/create-razorpay-order:", error);
    res.status(500).send("Internal Server Error");
  }
};

const sendOrderConfirmationEmail = async (orderDetails, user, book) => {
    const transporter = getMailTransporter();
    const mailOptions = {
        from: `"SecondBooks" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `Your SecondBooks Order is Confirmed! Order #${orderDetails.orderId}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Thank you for your order, ${user.firstName}!</h2>
                <p>Your order has been successfully placed. Here are the details:</p>
                <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
                    <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
                    <p><strong>Book:</strong> ${book.bookDescription}</p>
                    <p><strong>Amount Paid:</strong> ₹${orderDetails.amountPaid}</p>
                    <p><strong>Shipping to:</strong></p>
                    <p>${orderDetails.shippingAddress.replace(/\n/g, '<br>')}</p>
                </div>
                <p>We'll notify you again once your item has shipped.</p>
                <p>Thank you for shopping with SecondBooks!</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent successfully to:', user.email);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    const newOrder = new Order({
      ...orderDetails,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      orderStatus: 'Paid'
    });

    const savedOrder = await newOrder.save();

    const user = await User.findById(savedOrder.userId);
    const book = await Book.findOne({ bookId: savedOrder.orderBookId });

    if (user && book) {
        sendOrderConfirmationEmail(savedOrder, user, book);
    }

    res.json({
      success: true,
      message: "Payment successful and order saved.",
      orderId: savedOrder.orderId
    });

  } catch (error) {
    console.error("Error in /api/payment-verification:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
