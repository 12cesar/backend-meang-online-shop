
import { IResolvers } from 'graphql-tools';
import StripeCarService from '../../../services/stripe/card.service';

const resolversStripeCardMutation: IResolvers = {
    Mutation: {
        async createCardToken(_, { card }) {
            return new StripeCarService().createToken(card);
        },
        async createCard(_,{customer, tokenCard}){
            return new StripeCarService().create(customer, tokenCard);
        },
        async updateCard(_,{customer, card, details}){
            console.log(details);
            
            return new StripeCarService().update(customer, card, details);
        },
        async deleteCard(_,{customer, card}){
            return new StripeCarService().delete(customer, card);
        }
    }
};

export default resolversStripeCardMutation;