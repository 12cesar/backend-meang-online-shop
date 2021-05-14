import { Db } from 'mongodb';
import { COLLECTIONS } from '../../config/constants';
import { IStripeCustomer } from '../../interfaces/stripe/customer.interface';
import { IUser } from '../../interfaces/user.interfaces';
import { findOneElement } from '../../lib/db-operations';
import StripeApi, { STRIPE_ACTIONS, STRIPE_OBJECTS } from '../../lib/stripe-api';
import UserService from '../user.service';


class StripeCustomerService extends StripeApi {
   // Clientes lista
   async list (limit: number, startingAfter: string, endingBefore: string){
    const pagination = this.getPagination(startingAfter, endingBefore);
    return await this.execute(
        STRIPE_OBJECTS.CUSTOMERS,
        STRIPE_ACTIONS.LIST,
        {
            limit, ...pagination 
        }
    ).then((result: {has_more: boolean, data: Array<IStripeCustomer>}) => {
        return {
            status: true,
            message: 'Lista cargado correctamente con los clientes seleccionados',
            hasMore: result.has_more,
            customers: result.data
        };
      }).catch((error: Error) => this.getError(error) );
   }
   async get(id: string){
    return await this.execute(
        STRIPE_OBJECTS.CUSTOMERS,
        STRIPE_ACTIONS.GET,
        id
    ).then((result: IStripeCustomer) => {
        return {
            status: true,
            message: `El cliente ${result.name} se ha obtenido correctamente`,
            customer: result
        };
    }).catch((error: Error) => this.getError(error));
   }
   async add(name: string, email: string, db: Db){
       // Comprobar que el cliente no exista y en claso de que exista diciendo que no se puede añadir
       const userCheckExists: {data: Array<IStripeCustomer>} = await new StripeApi().execute(
        STRIPE_OBJECTS.CUSTOMERS,
        STRIPE_ACTIONS.LIST,
        {
            email
        }
    );
    if (userCheckExists.data.length > 0) {
        // usuario existe 
        return {
            status: false,
            message: `El usuario con el email: ${email} ya existe en el sistema`
        };
    }
    return await this.execute(
        STRIPE_OBJECTS.CUSTOMERS,
        STRIPE_ACTIONS.CREATE, {
        name,
        email,
        description: `${name} (${email})`
    }
    ).then(async (result: IStripeCustomer) => {
        // Actualizar en nuestra base de datos con la nueva propiedad que es el id del cliente
        const user: IUser = await findOneElement(db, COLLECTIONS.USERS, {email});
        if (user) {
            user.stripeCustomer = result.id;
            const resultUserOperation = await new UserService({}, {user},{db}).modify();
            console.log(resultUserOperation);
            // si el resultado es falso, no se ha ejecutado. tenemos que borrar el cliente creado en (stripe)                    
        }
        return {
            status: true,
            message: `El cliente ${name} se ha creado correctamente`,
            customer: result
        };
    }).catch((error: Error) => this.getError(error));
   }
   async update(id: string, customer: IStripeCustomer){
    console.log(id, customer);
    return await this.execute(
        STRIPE_OBJECTS.CUSTOMERS,
        STRIPE_ACTIONS.UPDATE,
        id,
        customer
    ).then((result: IStripeCustomer) => {
        return{
            status: true,
            message: `Usuario con el id: ${id} actualizado correctamente`,
            customer: result
        };
    }).catch((error:Error) => this.getError(error));
   }
   async delete (id: string, db: Db){
    return await this.execute(
        STRIPE_OBJECTS.CUSTOMERS,
        STRIPE_ACTIONS.DELETE,
        id
    ).then(async(result: {id: string, deleted: boolean}) => {
        if (result.deleted) {
            const resultOperation = await db
            .collection(COLLECTIONS.USERS)
            .updateOne({stripeCustomer: result.id}, { $unset: {stripeCustomer: result.id} });
            return{
                status: result.deleted && resultOperation ? true : false,
                message: result.deleted && resultOperation ? `Usuario con el id: ${id} ha sido eliminado correctamente` : `Usuario no ha sido eliminado correctamente en la base de datos`
            };
        }
        return{
            status: false,
            message: `Usuario con el id: ${id} no se ah eliminado correctamente, compruebalo`,
            customer: result
        };
    }).catch((error:Error) => this.getError(error));
   }
}

export default StripeCustomerService;