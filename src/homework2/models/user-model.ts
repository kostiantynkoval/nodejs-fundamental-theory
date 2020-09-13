import { DataTypes, Sequelize } from 'sequelize';
import { UserStatic } from '../types/';

export function UserFactory (sequelize: Sequelize): UserStatic {
    return <UserStatic>sequelize.define("users", {
        id: {
            type: DataTypes.UUIDV4,
            autoIncrement: true,
            primaryKey: true,
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        age: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });
}
