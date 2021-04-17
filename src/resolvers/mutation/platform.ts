// addPlatform

import { IResolvers } from 'graphql-tools';
import PlatformService from '../../services/plataform.service';

const resolversPlatformMutation:IResolvers={
    Mutation: {
        addPlatform(_,variables,context){
            // return new PlatformService(_,variables,context).insert();
        }
    }
};

export default resolversPlatformMutation;
 
