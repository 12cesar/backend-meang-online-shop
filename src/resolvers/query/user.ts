import { IResolvers } from 'graphql-tools';
import { COLLECTIONS, EXPIRETIME, MESSAGES } from './../../config/constants';
import JWT from './../../lib/jwt';
import bcrypt from 'bcrypt';
import { findElements, findOneElement } from '../../lib/db-operations';
import UserService from '../../services/user.service';
const resolversUserQuery: IResolvers = {
  Query: {
    async users(_, __, context) {
        return new UserService(_,__,context).items();
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
