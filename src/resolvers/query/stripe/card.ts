import { IResolvers } from 'graphql-tools';
import StripeCarService from '../../../services/stripe/card.service';
import StripeCustomerService from '../../../services/stripe/customer.service';
const resolversStripeCardQuery: IResolvers = {
    Query:{
        async card(_,{customer, card}){
            console.log(customer, card);
            
            return new StripeCarService().get(customer, card);
        },
        async cards(_,{customer, limit, startingAfter, endingBefore}){
            return new StripeCarService().list(customer, limit, startingAfter, endingBefore);
        }
    }
};

export default resolversStripeCardQuery;
