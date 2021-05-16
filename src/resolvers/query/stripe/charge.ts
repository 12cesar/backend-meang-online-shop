import { IResolvers } from '@graphql-tools/utils';
import StripeChargeService from '../../../services/stripe/charge.service';

const resolversStripeChargeQuery: IResolvers = {
    Query: {
        chargesByCustomers(_,{customer, limit, startingAfter, endingBefore}){
            console.log(limit);
            return new StripeChargeService().list(customer,limit, startingAfter, endingBefore);
        },
    }
};
export default resolversStripeChargeQuery;