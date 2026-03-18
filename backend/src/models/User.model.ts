import { Schema, model, Document, Types } from 'mongoose';

// ── Interface ─────────────────────────────────────────────────────────────────

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

// ── Schema ────────────────────────────────────────────────────────────────────

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // never returned by default
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    versionKey: false,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────

UserSchema.index({ email: 1 }, { unique: true });

// ── Model ─────────────────────────────────────────────────────────────────────

export const User = model<IUserDocument>('User', UserSchema);
