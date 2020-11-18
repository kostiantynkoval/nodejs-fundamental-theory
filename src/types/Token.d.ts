// eslint-disable-next-line no-unused-vars
import { Model } from 'sequelize';

interface TokenAttributes {
    tokenId: string;
    userId: string;
}

export interface TokenModel extends Model<TokenAttributes>, TokenAttributes {}
