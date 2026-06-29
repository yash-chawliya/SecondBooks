import Order from '../models/Order.js';
import Book from '../models/Book.js';

export const confirmOrder = async (req, res) => {
  try {
    const { orderId, userId, orderBookId, phone, itemAmount, paymentGatewayFee, discount, deliveryFee, amountPaid, paymentOption, shippingAddress, expectedDeliveryDate, orderStatus } = req.body;

    if (!userId || !orderBookId || !phone || !itemAmount || !amountPaid || !paymentOption || !shippingAddress) {
      return res.status(400).json({
        message: 'Missing required fields. Please provide userId, orderBookId, shippingAddress, and amountPaid.'
      });
    }

    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json({ order_id: savedOrder._id });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', details: error.message });
    }
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderid });
    if (!order) {
      return res.status(404).json({ message: 'Order not found or does not exist.' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the order', error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 }).lean();

    if (!orders || orders.length === 0) {
      return res.status(200).json([]);
    }

    const bookDetailPromises = orders.map(order => {
      return Book.findOne({ bookId: order.orderBookId }).lean();
    });

    const bookDetails = await Promise.all(bookDetailPromises);

    const combinedOrders = orders.map((order, index) => {
      return {
        ...order,
        bookDetails: bookDetails[index] || null
      };
    });

    res.status(200).json(combinedOrders);

  } catch (error) {
    console.error("Failed to fetch orders with book details:", error);
    res.status(500).json({ message: "Server error while fetching orders." });
  }
};
