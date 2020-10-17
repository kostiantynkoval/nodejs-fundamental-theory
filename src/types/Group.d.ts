import { HasManyAddAssociationsMixin, Model, Optional } from "sequelize";
import { User } from "../models/user.model";
import { Permission } from "../models/group.model";

interface GroupAttributes {
    id: string;
    name: string;
    permissions: Permission[];
}
// Some fields are optional when calling UserModel.create() or UserModel.build()
interface GroupCreationAttributes extends Optional<GroupAttributes, "id"> {}
interface GroupExtended {
    // getUsers: HasManyGetAssociationsMixin<typeof User>; // Note the null assertions!
    // addUser: HasManyAddAssociationMixin<typeof User, number>;
    addUsers: HasManyAddAssociationsMixin<typeof User, string>;
    // hasUser: HasManyHasAssociationMixin<typeof User, number>;
    // countUsers: HasManyCountAssociationsMixin;
    // createUser: HasManyCreateAssociationMixin<typeof User>;
}
export interface GroupModel extends Model<GroupAttributes, GroupCreationAttributes>, GroupAttributes, GroupExtended {}
