import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['patient', 'researcher'], // ← Lowercase
    default: 'patient' 
  },
  
  // Common fields
  bio: String,
  location: {
    city: String,
    country: String
  },
  
  // Patient fields
  conditions: [String],
  keywords: [String],
  
  // Researcher fields
  specialties: [String],
  researchInterests: [String],
  institution: String,
  orcid: String,
  availability: {
    type: String,
    enum: ['available', 'limited', 'unavailable'],
    default: 'available'
  },
  
  // Status
  onboarded: { type: Boolean, default: false },
  favorites: [{
    itemType: String,
    itemId: mongoose.Schema.Types.ObjectId
  }],
  
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model('User', UserSchema);