import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from './../../config/constants';
import bcrypt from 'bcrypt';
import { asignDocumentId, findOneElement, insertOneElement } from '../../lib/db-operations';
const resolversUserMutation:IResolvers={
    Mutation: {
        async register(_, {user}, { db }){
            //Comprobar que el usuario no existe 
            const userCheck=await findOneElement(db, COLLECTIONS.USERS,{email:user.email});

            if (userCheck!==null) {
                return {
                    status:false,
                    message:`El email ${user.email} esta registrado y no puedes registrate con este email`,
                    user:null
                };
            }
            // Comprobar el ultimo usuario registrado para asignar id
            user.id=await asignDocumentId(db,COLLECTIONS.USERS,{registerDate:-1});
            // Asignar la fecha en formato ISO en la propiedad registerDate
            user.registerDate=new Date().toISOString();
            //Encriptar password para
            user.password=bcrypt.hashSync(user.password,10);
            // Guardar el documento (registro) en la coleccion
            return await insertOneElement(db,COLLECTIONS.USERS,user)
                            .then(
                                async () =>{
                                    return {
                                        status:true,
                                        message:`El email con el ${user.email} esta registrado Correctamente`,
                                        user
                                    };
                                }
                            ).catch((err:Error) =>{
                                console.log(err.message);
                                return {
                                    status:false,
                                    message:`Error inesperado, prueba de nuevo`,
                                    user:null
                                };
                            });
        }
    }
};

export default resolversUserMutation;