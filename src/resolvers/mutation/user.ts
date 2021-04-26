import { IResolvers } from 'graphql-tools';
import UserService from '../../services/user.service';
const resolversUserMutation:IResolvers={
    Mutation: {
        register(_, {user}, context){
            //Comprobar que el usuario no existe 
            return new UserService(_,{user},context).register();
        },
        updateUser(_, {user}, context){
            //Comprobar que el usuario no existe 
            return new UserService(_,{user},context).modify();
        },
        deleteUser(_, {id}, context){
            //Comprobar que el usuario no existe 
            return new UserService(_,{id},context).delete();
        },
        blockUser(_,{id, unblock, admin},context){
            return new UserService(_,{id},context).unblock(unblock, admin);  
        }
    }
};

export default resolversUserMutation;