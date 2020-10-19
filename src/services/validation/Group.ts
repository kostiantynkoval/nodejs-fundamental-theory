import Joi from '@hapi/joi';
import { Permission } from '../../models/group.model';

export const groupSchema = Joi.object({
    name: Joi
        .string()
        .alphanum()
        .required(),

    permissions: Joi
        .array()
        .items(Joi.valid(Permission.READ, Permission.WRITE, Permission.DELETE, Permission.SHARE, Permission.UPLOAD_FILES).required())
        .required()
});
