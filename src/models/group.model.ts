import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../data-access/db";
import { GroupModel } from "../types";
import { User } from "./user.model";
import { v4 as uuidv4 } from "uuid";

export enum Permission {
    READ = 'READ',
    WRITE = 'WRITE',
    DELETE = 'DELETE',
    SHARE = 'SHARE',
    UPLOAD_FILES = 'UPLOAD_FILES',
}

export const Group = sequelize.define<GroupModel>("Group", {
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


// Functions manipulate Model's data

// Get all groups with users included
export const getAllGroups = async () => await Group.findAll( { include: User } );

// Get group by id
export const getGroupById = async (id: string) => await Group.findOne({
    where: {
        id
    },
    include: User,
});

// Update group by id
export const updateGroup = async (value: {name?: string, permissions?: Permission[]}, id: string) => await Group.update(value, {
    where: {
        id
    }
});

// Delete group by id
export const deleteGroup = async (id: string) => await Group.destroy( {
    where: {
        id
    }
});

// Create new group
export const createGroup = async (value: {name: string, permissions: Permission[]}) => await Group.create({
    id: uuidv4(),
    ...value,
});
