import * as sequelize from 'sequelize';
import { UserFactory } from "../models/user-model";

export const dbConfig = new sequelize.Sequelize(
    "deq58cmdf0d86v",
    "djkmhhnuvliiuu",
    "441fb6e100db768c59f873967963e3d056fc0bb9a5fe41b219d9fb32b06c021b",
    {
        port: 5432,
        host: "ec2-176-34-114-78.eu-west-1.compute.amazonaws.com",
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            },
        },
        ssl: true,
        pool: {
            min: 0,
            max: 5,
            acquire: 30000,
            idle: 10000,
        },
    }
);

// THIS ONES ARE THE ONES YOU NEED TO USE ON YOUR CONTROLLERS
export const User = UserFactory(dbConfig)
