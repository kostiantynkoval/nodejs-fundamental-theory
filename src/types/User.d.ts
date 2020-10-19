/* eslint-disable no-unused-vars */
import { HasManyAddAssociationsMixin, Optional, Model } from 'sequelize';
import { Group } from '../models/group.model';
/* eslint-enable no-unused-vars */

interface UserAttributes {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}
// Some fields are optional when calling UserModel.create() or UserModel.build()
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
interface UserExtended {
    // getGroups: HasManyGetAssociationsMixin<typeof Group>; // Note the null assertions!
    // addGroup: HasManyAddAssociationMixin<typeof Group, number>;
    addGroups: HasManyAddAssociationsMixin<typeof Group, string>;
    // hasGroup: HasManyHasAssociationMixin<typeof Group, number>;
    // countGroups: HasManyCountAssociationsMixin;
    // createGroup: HasManyCreateAssociationMixin<typeof Group>;
}
export interface UserModel extends Model<UserAttributes, UserCreationAttributes>, UserAttributes, UserExtended {}
