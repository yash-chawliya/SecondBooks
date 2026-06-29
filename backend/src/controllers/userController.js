import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'Profile updated successfully!', user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressToDelete } = req.body;
    if (!addressToDelete) {
      return res.status(400).json({ message: 'Address to delete is required.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { address: addressToDelete } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'Address deleted successfully!', user: updatedUser });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Server error while deleting address.' });
  }
};

export const getAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const userRequired = await User.findById(userId);

    if (!userRequired) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(userRequired.address);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching the user address.' });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { addressToAdd, userId } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { address: addressToAdd } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'Address added Successfully!', address: updatedUser.address });
  } catch (error) {
    res.status(500).json({ message: 'Server error while adding address.', error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await User.findById(req.params.userId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the cart.' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const bookId = req.params.bookId;
    
    if (!userId || !bookId) {
      return res.status(400).json({ message: 'User ID and Book ID are required.' });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { cart: bookId } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'Book added to cart!', cart: updatedUser.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error while adding to cart.', error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const { userId } = req.body;
    
    if (!userId || !bookId) {
      return res.status(400).json({ message: 'User ID and Book ID are required.' });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: bookId } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'Book removed from cart.', cart: updatedUser.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error while removing from cart.', error: error.message });
  }
};

export const getDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "Userid not provided" });
    }
    const userDetails = await User.findById(userId);
    res.status(200).json({ firstName: userDetails.firstName, phone: userDetails.phone });
  } catch (error) {
    res.status(500).json({ message: 'error in getdetails.', error: error.message });
  }
};

export const checkUser = async (req, res) => {
  try {
    const phone = req.params.phone;
    if (!phone) {
      return res.json({ message: "Phone number is required." });
    }
    const user = await User.findOne({ phone });
    if (!user) {
      return res.json({ success: false, message: "User not registered. Please sign-up." });
    }
    res.json({ success: true, userId: user._id, firstName: user.firstName });
  } catch (error) {
    res.json({ message: "error in checkuser", error: error });
  }
};

export const getUserId = async (req, res) => {
  try {
    const phone = req.params.phone;
    if (!phone) {
      return res.json({ message: "Phone number is required." });
    }
    const user = await User.findOne({ phone });
    res.json({ userId: user._id });
  } catch (error) {
    res.json({ message: "error in getUserId", error: error });
  }
};
