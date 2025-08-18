import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['customer', 'rider'],
    required: true,
  },
  firstName: {
    type: String,
    required: false,
    trim: true,
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
  },
}, { timestamps: true });

// Méthode pour créer un access token
UserSchema.methods.createAccessToken = function () {
  return jwt.sign(
    { id: this._id, phone: this.phone, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '4d' }
  );
};

// Méthode pour créer un refresh token
UserSchema.methods.createRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d' }
  );
};

export default mongoose.model('User', UserSchema);
