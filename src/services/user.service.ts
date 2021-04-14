import { COLLECTIONS, EXPIRETIME, MESSAGES } from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import { asignDocumentId, findOneElement, insertOneElement } from '../lib/db-operations';
import ResolversOperationsService from './resolvers-operations.service';
import bcrypt from 'bcrypt';
import JWT from '../lib/jwt';
class UserService extends ResolversOperationsService {
  private collection = COLLECTIONS.USERS;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  // Lista de usuarios
  async items() {
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(
      this.collection,
      'usuarios',
      page,
      itemsPage
    );
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      users: result.item,
    };
  }
  // Autenticarnos
  async auth() {
    let info = new JWT().verify(this.getContext().token!);
    if (info === MESSAGES.TOKEN_VERICATION_FAILED) {
      return {
        status: false,
        message: info,
        user: null,
      };
    }
    return {
      status: true,
      message: 'Usuario autenticado correctamente mediante token',
      user: Object.values(info)[0],
    };
  }
  // Iniciar sesion
  async login() {
    try {
      const variables = this.getVariables().user;
      const user = await findOneElement(this.getDb(), this.collection, {
        email: variables?.email,
      });
      console.log(user);

      if (user === null) {
        return {
          status: false,
          message: 'Usuario no existe',
          token: null,
        };
      }
      const passwordCheck = bcrypt.compareSync(
        variables?.password,
        user.password
      );
      if (passwordCheck !== null) {
        delete user.password;
        delete user.birthday;
        delete user.registerDate;
      }
      return {
        status: passwordCheck,
        message: !passwordCheck
          ? 'Password y usuario no correctos, Sesion no iniciada'
          : 'Usuario cargada correctamente',
        token: !passwordCheck ? null : new JWT().sign({ user }, EXPIRETIME.H24),
        user: !passwordCheck ? null : user,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'Error al cargar el usuario.Comprueba correctamente todo',
        user: null,
      };
    }
  }
  // Registrar un usuario
  async register() {
    const user = this.getVariables().user;
    // Comprobar que user no es nulo
    if (user === null) {
      return {
        status: false,
        message: 'Usuario no definido, procura definirlo',
        user: null,
      };
    }
    if (
      user?.password === null ||
      user?.password === undefined ||
      user?.password === ''
    ) {
      return {
        status: false,
        message: 'Usuario sin password correcto, procura definirlo',
        user: null,
      };
    }
    const userCheck = await findOneElement(this.getDb(), this.collection, {
      email: user?.email,
    });

    if (userCheck !== null) {
      return {
        status: false,
        message: `El email ${user?.email} esta registrado y no puedes registrate con este email`,
        user: null,
      };
    }
    // Comprobar el ultimo usuario registrado para asignar id
    user!.id = await asignDocumentId(this.getDb(), this.collection, {
      registerDate: -1,
    });
    // Asignar la fecha en formato ISO en la propiedad registerDate
    user!.registerDate = new Date().toISOString();
    //Encriptar password para
    user!.password = bcrypt.hashSync(user!.password, 10);

    const result = await this.add(this.collection, user || {}, 'usuario');
    // Guardar el documento (registro) en la coleccion
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }
  // Actualizar usuario
  async modify() {
    const user = this.getVariables().user;
    if (user === null) {
      return {
        status: false,
        message: 'Usuario no definido, procura definirlo',
        user: null,
      };
    }
    const filter = { id: user?.id };
    const result = await this.update(
      this.collection,
      filter,
      user || {},
      'usuario'
    );
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }
  // Eliminar usuario
  async delete() {
    const id = this.getVariables().id;
    if (id === undefined || id === '') {
      return {
        status: false,
        message:
          'Identificador del usuario no definido, procura definirlo para eliminar el usuario',
        user: null,
      };
    }
    const result = await this.del(this.collection, { id }, 'usuario');
    return {
      status: result.status,
      message: result.message,
    };
  }
  async block() {
    const id = this.getVariables().id;
    if (!this.checkData(String(id) || '')) {
      return {
        status: false,
        message: 'El ID del Usuario no se ha especificado correctamente',
        genre: null,
      };
    }
    const result = await this.update(
      this.collection,
      { id },
      { active: false },
      'usuario'
    );
    return {
      status: result.status,
      message: result.status
        ? 'Boqueado Correctamente'
        : 'No se ha bloqueado comprobado por favor',
    };
  }
  private checkData(value: string) {
    return value === '' || value === undefined ? false : true;
  }
}

export default UserService;