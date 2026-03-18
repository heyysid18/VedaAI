import { FilterQuery, Types } from 'mongoose';
import { User, IUser } from '../models/User.model';

// ── Plain object types returned from .lean() ──────────────────────────────────

type LeanUser = IUser & { _id: Types.ObjectId };

export type CreateUserDTO = Pick<IUser, 'name' | 'email' | 'passwordHash'>;
export type UpdateUserDTO = Partial<Pick<IUser, 'name' | 'email' | 'isActive'>>;

// ── Read ──────────────────────────────────────────────────────────────────────

export async function findAllUsers(
  filter: FilterQuery<LeanUser> = {}
): Promise<LeanUser[]> {
  return User.find(filter).select('-passwordHash').lean<LeanUser[]>();
}

export async function findUserById(id: string): Promise<LeanUser | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return User.findById(id).select('-passwordHash').lean<LeanUser>();
}

export async function findUserByEmail(email: string): Promise<LeanUser | null> {
  return User.findOne({ email: email.toLowerCase() }).lean<LeanUser>();
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createUser(data: CreateUserDTO): Promise<LeanUser> {
  const user = new User(data);
  const saved = await user.save();
  return saved.toObject() as LeanUser;
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateUser(
  id: string,
  data: UpdateUserDTO
): Promise<LeanUser | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
    .select('-passwordHash')
    .lean<LeanUser>();
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteUser(id: string): Promise<boolean> {
  if (!Types.ObjectId.isValid(id)) return false;
  const result = await User.findByIdAndDelete(id);
  return result !== null;
}
