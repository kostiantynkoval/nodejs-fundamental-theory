import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../data-access/db";

export enum Permission {
    READ = 'READ',
    WRITE = 'WRITE',
    DELETE = 'DELETE',
    SHARE = 'SHARE',
    UPLOAD_FILES = 'UPLOAD_FILES',
}

export const Group = sequelize.define("Group", {
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.ENUM({values: [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.SHARE, Permission.UPLOAD_FILES]})),
        allowNull: false,
    },
})

// "permissions": ["READ","WRITE","DELETE","SHARE","UPLOAD_FILES"]
