import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First name is required.'], trim: true },
  lastName: { type: String, required: [true, 'Last name is required.'], trim: true },
  phone: {
    type: String, required: [true, 'Phone number is required.'], trim: true, validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
  },
  email: { type: String, required: [true, 'Email is required.'], unique: true, lowercase: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
  password: { type: String, required: [true, 'Password is required.'] },
  cart: { type: [String], default: [] },
  address: { type: [String], default: [] }
});

// Hash the password before saving a new user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
