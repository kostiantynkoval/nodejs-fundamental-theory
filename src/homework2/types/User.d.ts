import { BuildOptions, Model } from "sequelize";
export interface UserAttributes {
    id: string;
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
