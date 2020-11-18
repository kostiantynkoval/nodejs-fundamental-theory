import { DataTypes, UUIDV4 } from 'sequelize';
import { sequelize } from '../data-access/db';
// eslint-disable-next-line no-unused-vars
import { TokenModel } from '../types/Token';

export const Token = sequelize.define<TokenModel>('Token', {
    tokenId: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    }
});
