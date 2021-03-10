import { IResolvers } from 'graphql-tools';
import { COLLECTIONS, EXPIRETIME, MESSAGES } from './../../config/constants';
import JWT from './../../lib/jwt';
import bcrypt from 'bcrypt';
import { findElements, findOneElement } from '../../lib/db-operations';
const resolversUserQuery: IResolvers = {
  Query: {
    async users(_, __, { db }) {
      /* console.log(root);
            console.log(args);
            console.log(context);
            console.log(info); */
      try {
        return {
          status: true,
          message: 'Lista de usuarios cargadas correctamente',
          users: await findElements(db,COLLECTIONS.USERS),
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message:
            'Error al cargar los usuarios.Comprueba correctamente al cargar todo',
          users: [],
        };
      }
    },
    async login(_, { email, password }, { db }) {
      try {
        const user = await findOneElement(db, COLLECTIONS.USERS,{email:email});
        console.log(user);
        
        if (user === null) {
          return {
            status: false,
            message: 'Usuario no existe',
            token: null,
          };
        }
        const passwordCheck = bcrypt.compareSync(password, user.password);
        if (passwordCheck !== null) {
          delete user.password;
          delete user.birthday;
          delete user.registerDate;
        }
        return {
          status: true,
          message: !passwordCheck
            ? 'Password y usuario no correctos, Sesion no iniciada'
            : 'Usuario cargada correctamente',
          token: !passwordCheck
            ? null
            : new JWT().sign({ user }, EXPIRETIME.H24),
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message: 'Error al cargar el usuario.Comprueba correctamente todo',
          user: null,
        };
      }
    },
    me(_, __, { token }) {
      console.log(token);
      let info=new JWT().verify(token);
      if (info===MESSAGES.TOKEN_VERICATION_FAILED) {
        return {
          status:false,
          message: info,
          user:null
        };
      }
      return {
        status:true,
        message:'Usuario autenticado correctamente mediante token',
        user:Object.values(info)[0]
      };
    }
  },
};

export default resolversUserQuery;
