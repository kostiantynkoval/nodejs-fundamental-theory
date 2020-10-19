import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
    'deq58cmdf0d86v',
    'djkmhhnuvliiuu',
    '441fb6e100db768c59f873967963e3d056fc0bb9a5fe41b219d9fb32b06c021b',
    {
        port: 5432,
        host: 'ec2-176-34-114-78.eu-west-1.compute.amazonaws.com',
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
