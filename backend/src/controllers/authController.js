import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: 'User not registered. Please register.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: 'Login successful!',
      userId: user._id,
      cart: user.cart
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

export const phoneLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone: phone });
    if (!user) {
      return res.status(400).json({ message: 'User not registered. Please register.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    res.status(200).json({ message: 'Login successful!', userId: user._id, cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;
    if (!firstName || !lastName || !phone || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    const newUser = new User({ firstName, lastName, phone, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

export const verifySession = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ userId: decoded.userId });
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: 'Logout successful' });
};
