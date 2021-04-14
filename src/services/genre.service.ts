import { COLLECTIONS } from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import ResolversOperationsService from './resolvers-operations.service';
import { findOneElement, asignDocumentId } from '../lib/db-operations';
import slugify from 'slugify';

class GenreService extends ResolversOperationsService {
  collection = COLLECTIONS.GENRES;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }
  async items() {
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    console.log(this.getVariables().pagination);
    console.log(page, itemsPage);
    const result = await this.list(this.collection, 'géneros', page, itemsPage);
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      genres: result.item,
    };
  }
  async details() {
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }
  async insert() {
    const genre = this.getVariables().genre;
    //Conprobar que no esta en blanco ni es indefinido
    if (!this.checkData(genre || '')) {
      return {
        status: false,
        message: 'El genero no se ha especificado correctamente',
        genre: null,
      };
    }
    //Comprobar que no existe
    if (await this.chekInDatabase(genre || '')) {
      return {
        status: false,
        message: 'El genero existe en la base de datos intenta con otro género',
        genre: null,
      };
    }
    // Si valida las opciones anteriores, venir aqui y crear el documento
    const genreObject = {
      id: await asignDocumentId(this.getDb(), this.collection, { id: -1 }),
      name: genre,
      slug: slugify(genre || '', { lower: true }),
    };
    const result = await this.add(this.collection, genreObject, 'género');
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }
  async modify() {
    const id = this.getVariables().id;
    const genre = this.getVariables().genre;
    if (!this.checkData(String(id) || '')) {
      return {
        status: false,
        message: 'El ID del genero no se ha especificado correctamente',
        genre: null,
      };
    }

    if (!this.checkData(genre || '')) {
      return {
        status: false,
        message: 'El genero no se ha especificado correctamente',
        genre: null,
      };
    }
    const objectUpdate = {
      name: genre,
      slug: slugify(genre || '', { lower: true }),
    };
    const result = await this.update(
      this.collection,
      { id },
      objectUpdate,
      'género'
    );
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }
  async delete() {
    const id = this.getVariables().id;
    if (!this.checkData(String(id) || '')) {
      return {
        status: false,
        message: 'El ID del genero no se ha especificado correctamente',
        genre: null,
      };
    }
    const result = await this.del(this.collection, { id }, 'género');
    return {
      status: result.status,
      message: result.message,
    };
  }
  private checkData(value: string) {
    return value === '' || value === undefined ? false : true;
  }
  private async chekInDatabase(value: string) {
    return await findOneElement(this.getDb(), this.collection, {
      name: value,
    });
  }
  async block() {
    const id = this.getVariables().id;
    if (!this.checkData(String(id) || '')) {
      return {
        status: false,
        message: 'El ID del genero no se ha especificado correctamente',
        genre: null,
      };
    }
    const result = await this.update(
      this.collection,
      { id },
      { active: false },
      'género'
    );
    return {
      status: result.status,
      message: result.status
        ? 'Boqueado Correctamente'
        : 'No se ha bloqueado comprobado por favor',
    };
  }
}
export default GenreService;