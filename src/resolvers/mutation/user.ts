import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from './../../config/constants';
import bcrypt from 'bcrypt';
import { asignDocumentId, findOneElement, insertOneElement } from '../../lib/db-operations';
import UserService from '../../services/user.service';
const resolversUserMutation:IResolvers={
    Mutation: {
        async register(_, {user}, context){
            //Comprobar que el usuario no existe 
            return new UserService(_,{user},context).register();
        },
        async updateUser(_, {user}, context){
            //Comprobar que el usuario no existe 
            return new UserService(_,{user},context).modify();
        },
        async deleteUser(_, {id}, context){
            //Comprobar que el usuario no existe 
            return new UserService(_,{id},context).delete();
        }
    }
};

export default resolversUserMutation;