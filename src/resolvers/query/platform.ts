// platforms

import { IResolvers } from 'graphql-tools';
import PlatformService from '../../services/plataform.service';

const resolversPlataformQuery: IResolvers = {
    Query: {
      platforms(_,variables,context){
        return new PlatformService(_,{pagination:variables},context).items();
      },
      platform(_,{id},context){
        return new PlatformService(_,{id},context).details();
      }
    },
  };

export default resolversPlataformQuery;