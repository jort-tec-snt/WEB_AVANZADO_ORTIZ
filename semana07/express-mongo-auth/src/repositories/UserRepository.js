import User from '../models/User.js';

class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email) {
    return await User.findOne({ email }).populate('roles').exec();
  }

  async findById(id) {
    return await User.findById(id).populate('roles').exec();
  }

  async updatePassword(id, hashedPassword) {
    return await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    ).exec();
  }

  async getAll() {
    return await User.find().populate('roles').exec();
  }

  async updateById(id, data) {
    return await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-password -__v').populate('roles').exec();
  }
}

export default new UserRepository();
