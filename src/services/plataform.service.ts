import slugify from 'slugify';
import { COLLECTIONS } from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import { asignDocumentId, findOneElement } from '../lib/db-operations';
import ResolversOperationsService from './resolvers-operations.service';

class PlatformService extends ResolversOperationsService {
    collection = COLLECTIONS.PLATFORMS;
    constructor(root: object, variables: object, context: IContextData) {
      super(root, variables, context);
    }
    async items(){
        const page= this.getVariables().pagination?.page;
        const itemPage= this.getVariables().pagination?.itemsPage;
        const result = await this.list(this.collection,'platforms',page,itemPage);
        return {
            info:result.info,
            status:result.status,
            message:result.message,
            platforms:result.item
        };
    }
    async details(){
        const result = await this.get(this.collection);
        return{
            status: result.status,
            message: result.message,
            platform:result.item
        };
    }
    async insert(){
        const platform= this.getVariables().platform;
        if (!this.checkData(platform || '')) {
            return {
                status: false,
                message: 'La plataforma no se ha especificado correctamente',
                tag: null
            };
        }
        if (await this.checkInDatabase(platform || '')) {
            return{
                status: false,
                message: 'La plataforma existe en la base de datos, intenta con otra plataforma',
                tag: null
            };
        }
        const tagObject={
            id: await asignDocumentId(this.getDb(),this.collection,{id:-1}),
            name: platform,
            slug: slugify(platform || '', {lower:true})
        };
        const result = await this.add(this.collection,tagObject,'plataforma');
        return{
            status: result.status,
            message: result.message,
            platform:result.item
        };
    }
    private checkData(value: string){
        return (value==='' || value===undefined) ? false : true;
    }
    private async checkInDatabase(value:string){
        return await findOneElement(this.getDb(),this.collection,{name:value});
    }
}
export default PlatformService;