import { User, UserPassword, Address } from "../../database/models";
import { SignUp } from "../../interfaces/Auth.interface";
import {
  CreateUser,
  User as UserInterface,
} from "../../interfaces/User.interface";
import { Transaction } from "sequelize";

const authRepo = {
  findUserByEmail: async (email: string): Promise<User | null> => {
    return await User.findOne({
      where: { email },
      include: [
        {
          model: UserPassword,
          as: "password",
        },
      ],
    });
  },

  findUserById: async (id: string): Promise<User | null> => {
    return await User.findByPk(id, {
      include: [
        {
          model: UserPassword,
          as: "password",
        },
      ],
    });
  },

  findActiveUserByEmail: async (email: string): Promise<User | null> => {
    return await User.findOne({
      where: {
        email,
        status: "active",
      },
      include: [
        {
          model: UserPassword,
          as: "password",
        },
      ],
    });
  },

  createUser: async (userData: SignUp, hashPass: string): Promise<User> => {
    const sequelize = User.sequelize;
    const transaction: Transaction = await sequelize!.transaction();
    try {
      const data = userData.user as CreateUser;
      data.role = "user";
      data.status = "active";
      data.email = data.email.toLowerCase();
      const user = await User.create(data, { transaction });
      await UserPassword.create(
        { userId: user.id, passwordHash: hashPass },
        { transaction }
      );
      await Address.create(
        {
          userId: user.id,
          ...userData.address,
        },
        { transaction }
      );
      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  updateUserPassword: async (
    userId: string,
    newPasswordHash: string
  ): Promise<void> => {
    await UserPassword.update(
      { passwordHash: newPasswordHash },
      { where: { userId } }
    );
  },

  getUserPassword: async (userId: string): Promise<UserPassword | null> => {
    return await UserPassword.findOne({
      where: { userId },
    });
  },
};

export default authRepo;
