import { IStripeCard } from '../../interfaces/stripe/card.interface';
import StripeApi, { STRIPE_ACTIONS, STRIPE_OBJECTS } from '../../lib/stripe-api';

class StripeCarService extends StripeApi{
    async createToken(card: IStripeCard){
        return await this.execute(
            STRIPE_OBJECTS.TOKENS,
            STRIPE_ACTIONS.CREATE,
            {
                card: {
                    number: card.number,
                    exp_month: card.expMonth,
                    exp_year: card.expYear,
                    cvc: card.cvc
                }
            }
        ).then((result: {id: string}) => {
            return {
                status: true,
                message: `Token ${result.id} creado correctamente`,
                token: result.id
            };
        }).catch((error: Error) => this.getError(error)); 
    }
    async create(customer: string, tokenCard: string){
        return this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.CREATE_SOURCE,
            customer,
            {
                source: tokenCard
            }
        ).then((result: IStripeCard) => {
            return {
                status: true,
                message: `Tarjeta con el ${result.id} creado correctamente`,
                id: result.id,
                card: result
            };
        }).catch((error: Error) => this.getError(error)); 
    }
    async get(customer: string, card: string){
        return this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.RETRIEVE_SOURCE,
            customer,
            card
        ).then((result: IStripeCard) => {
            return {
                status: true,
                message: `Detalle de la tarjeta ${result.id} creada correctamente`,
                id: result.id,
                card: result
            };
        }).catch((error: Error) => this.getError(error)); 
    }
    async update(customer: string, card: string, details: object){
        return this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.UPDATE_SOURCE,
            customer,
            card,
            details
        ).then((result: IStripeCard) => {
            return {
                status: true,
                message: `Actualizado ${result.id} correctamente`,
                id: result.id,
                card: result
            };
        }).catch((error: Error) => this.getError(error)); 
    }
    async delete(customer: string, card: string){
        return this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.DELETE_SOURCE,
            customer,
            card
        ).then((result: {id: string, deleted: boolean}) => {
            return {
                status: result.deleted,
                message: result.deleted ? `El item ${result.id} eliminado correctamente`: `El item ${result.id} no se ha eliminado`,
                id: result.id
            };
        }).catch((error: Error) => this.getError(error)); 
        /* stripe.customers.deleteSource(
            'cus_JTeC48zJJRHmUa',
            'card_1IqguTF7ZssJSc12z2iBkgwW'
          ); */
    }
    async list(customer: string, limit: number = 5, startingAfter: string = '', endingBefore: string = ''){
        const pagination = this.getPagination(startingAfter, endingBefore);
        return await this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.LIST_SOURCE,
            customer,
            {object:'card', limit, ...pagination}
        ).then((result: {has_more:boolean, data:Array<IStripeCard>}) => {
            return {
                status: true,
                message: `Listado de tarjetas mostrada correctamente`,
                cards: result.data,
                hasMore: result.has_more
            };
        }).catch((error: Error) => this.getError(error)); 
    }
    async removeOtherCards(customer: string, noDeleteCard: string){
        const listCards = (await this.list(customer)).cards;
        listCards?.map(async(item: IStripeCard) => {
            if (item.id !== noDeleteCard && noDeleteCard !== '') {
                await this.delete(customer, item.id || '');
            }
        });

    }
}

export default StripeCarService;