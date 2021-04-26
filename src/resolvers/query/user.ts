import { IResolvers } from 'graphql-tools';
import UserService from '../../services/user.service';
const resolversUserQuery: IResolvers = {
  Query: {
    async users(_, {page,itemsPage,active}, context) {
      console.log(active);
      
        return new UserService(_,{pagination:{page,itemsPage}},context).items(active);
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
