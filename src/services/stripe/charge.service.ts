import { PubSub } from 'apollo-server-express';
import { Db } from 'mongodb';
import { IStock } from '../../interfaces/stock.interface';
import { IStripeCharge } from '../../interfaces/stripe/charge.interface';
import { IPayment } from '../../interfaces/stripe/payment.interface';
import StripeApi, { STRIPE_ACTIONS, STRIPE_OBJECTS } from '../../lib/stripe-api';
import ShopProductsService from '../shop-product.service';
import StripeCarService from './card.service';
import StripeCustomerService from './customer.service';

class StripeChargeService extends StripeApi{
    private async getClient(customer: string){
        return new StripeCustomerService().get(customer);
    }
    async order(payment: IPayment, stockChange: Array<IStock>, pubsub: PubSub, db: Db){
        // Comprobar que existe el cliente
        const userData = await this.getClient(payment.customer);
        if (userData && userData.status === true) {
            console.log('Cliente encontrado');
            if (payment.token !== undefined) {
                // Asociar el cliente a la tarjeta
                const cardCreate = await new StripeCarService().create(
                    payment.customer, payment.token
                );
                // Actualizar como fuetne predeterminada de pago
                await new StripeCustomerService().update(
                    payment.customer,{
                        default_source: cardCreate.card?.id
                    }
                );
                // Actualizar borrando las demas tarjetas de ese cliente
                await new StripeCarService().removeOtherCards(payment.customer, cardCreate.card?.id || '');
            }else if (payment.token === undefined && userData.customer?.default_source === null){
                return {
                    status: false,
                    message: 'El cliente no tiene ningun metodo de pago asignado'
                };
            }
        }else{
            return {
                status: false,
                message: 'El cliente no encontrado y no se puede realizar el pago'
            };
        }
        delete payment.token;
        // Convertir a 0 decimal
        payment.amount = Math.round((+payment.amount + Number.EPSILON) * 100)/100;
        payment.amount *= 100;
        payment.amount = Math.round(payment.amount);
        
        return await this.execute(
            STRIPE_OBJECTS.CHARGES,
            STRIPE_ACTIONS.CREATE,
            payment
        ).then((result:object) => {
            new ShopProductsService({},{},{db}).updateStock(stockChange, pubsub);
            return{
                status: true,
                message: 'Pago realizado correctamente',
                charge: result
            };
        }).catch((error: Error) => this.getError(error));
    }
    async list(customer: string, limit: number = 5, startingAfter: string, endingBefore: string){
        const pagination = this.getPagination(startingAfter, endingBefore);
        return await this.execute(
            STRIPE_OBJECTS.CHARGES,
            STRIPE_ACTIONS.LIST,
            {limit, customer, ...pagination}
        ).then((result: {has_more: boolean, data: Array<IStripeCharge>}) => {
            return {
                status: true,
                message: 'Lista cargada correctamente con los pagos del cliente seleccionado',
                hasMore: result.has_more,
                charges: result.data
            };
          }).catch((error: Error) => this.getError(error) );
    }
}

export default StripeChargeService;