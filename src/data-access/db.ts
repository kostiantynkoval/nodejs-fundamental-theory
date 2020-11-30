import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
    process.env.DB_ID,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        port: +process.env.DB_PORT,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        ssl: true,
        pool: {
            min: 0,
            max: 5,
            acquire: 30000,
            idle: 10000
        },
        logging: console.log
    }
);
