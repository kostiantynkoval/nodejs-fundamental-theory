import { BuildOptions, Model } from "sequelize";
import { v4String } from "uuid/interfaces";
export interface UserAttributes {
    id: v4String;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}
export interface UserModel extends Model<UserAttributes>, UserAttributes {}
export class User extends Model<UserModel, UserAttributes> {}
export type UserStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): UserModel;
};
