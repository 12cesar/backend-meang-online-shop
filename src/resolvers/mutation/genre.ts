import { IResolvers } from 'graphql-tools';
import GenreService from '../../services/genre.service';

const resolversGenreMutation:IResolvers={
    Mutation: {
        addGenre(_,variables,context){
            //Añadimos llamada al serivicios
            return new GenreService(_,variables,context).insert();
        },
        updateGenre(_,variables,context){
            //Añadimos llamada al serivicios
            return new GenreService(_,variables,context).modify();
        },
        deleteGenre(_,variables,context){
            //Añadimos llamada al serivicios
            return new GenreService(_,variables,context).delete();
        }
    }
};

export default resolversGenreMutation;