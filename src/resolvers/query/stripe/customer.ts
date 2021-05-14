import { IResolvers } from 'graphql-tools';
import StripeCustomerService from '../../../services/stripe/customer.service';
const resolversStripeQuery: IResolvers = {
    Query:{
        async customers(_,{limit, startingAfter, endingBefore}){
            console.log(limit);
            return new StripeCustomerService().list(limit, startingAfter, endingBefore);
        },
        async customer(_,{id}){
            console.log(id);
            return new StripeCustomerService().get(id);
        }
    }
};

export default resolversStripeQuery;
