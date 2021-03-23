import { IResolvers } from 'graphql-tools';
import { pagination } from '../../lib/pagination';
import UserService from '../../services/user.service';
const resolversUserQuery: IResolvers = {
  Query: {
    async users(_, variables, context) {
      
      console.log(variables);
      
        return new UserService(_,{pagination:variables},context).items();
    },
    async login(_, { email, password }, context) {
        return new UserService(_,{user: {email,password}},context).login();
    },
    me(_, __, { token }) {
      return new UserService(_,__,{token}).auth();
    }
  },
};

export default resolversUserQuery;
