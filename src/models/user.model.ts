import { DataTypes, Op, UUIDV4 } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { sequelize } from '../data-access/db';
import { Group } from './group.model';
import { SECRET } from "../mockedData";
// eslint-disable-next-line no-unused-vars
import { UserModel } from '../types';

export const User = sequelize.define<UserModel>('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

// FIXME: Didn't find another place to put these definitions. Works only if both definitions are put together at same place
User.belongsToMany(Group, { through: 'UserGroup', onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true });
Group.belongsToMany(User, { through: 'UserGroup', onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true });


// Functions manipulate Model's data

// Get users filtered by login and/or limited
export const getAutoSuggestUsers = async (loginSubstring: string | undefined, limit:  string | undefined) => await User.findAll({
    ...loginSubstring && {
        where: {
            [Op.and]: {
                login: {
                    [Op.regexp]: `^${loginSubstring}`
                },
                isDeleted: false
            }
        }
    },
    order: [
        ['login', 'ASC']
    ],
    ...limit && { limit: +limit },
    include: Group
});

// Get all users with truthy deleted flags and DESC ordered
export const getAllUsersWithDeleted = async () => await User.findAll({
    order: [
        ['login', 'DESC']
    ],
    include: Group
});

// Get all users with truthy deleted flags and DESC ordered by login (no Groups included)
export const getAllUsers = async () => await User.findAll({
    order: [
        ['login', 'DESC']
    ],
    where: {
        isDeleted: false
    }
});

// Get user by id
export const getUserById = async (id: string) => await User.findOne({
    where: {
        id
    }
});

// Create new user
// TODO: Write function to hash password and save hash to db, not the password itself
export const createUser = async ({ login, password, age }: { login: string, password: string, age: number }) => await User.create({
    id: uuidv4(),
    login,
    password,
    age,
    isDeleted: false
});

// Update user
// TODO: Write function to hash password and save hash to db, not the password itself
export const updateUser = async (value: {login: string, password: string, age: number, isDeleted: boolean}, id: string) => await User.update(value, {
    where: {
        id
    }
});

// Delete user (mark isDelete field as true, not delete user from the db)
export const deleteUser = async (id: string) => await User.update({ isDeleted: true }, {
    where: {
        id
    }
});

// Login
export const loginUser = async ( { login, password }: { login: string, password: string } ) => {
    const user = await User.findOne({
        where: {
            login,
            password
        }
    });
    if (!user) {
        return {error: "False credentials"}
    }
    const payload = {
        id: user.id,
        login: user.login,
        age: user.age
    }
    return { token: jwt.sign(payload, SECRET, { expiresIn: 300 }) }
}
