import { IUser } from './user.interfaces';
import { IPaginationOptions } from './pagination-options.interface';

export interface IVariables{
    id?:string|number;
    genre?:string;
    tag?:string;
    platform?:string;
    user?:IUser;
    pagination?:IPaginationOptions;
}