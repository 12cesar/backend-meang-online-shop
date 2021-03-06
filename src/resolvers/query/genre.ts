import { IResolvers } from 'graphql-tools';
import GenreService from '../../services/genre.service';

const resolversGenreQuery: IResolvers = {
    Query: {
        async genres(_, variables, { db }){
           
            return new GenreService(_,{pagination:variables},{ db }).items();
        },
        async genre(_,{id},{db}){
            return new GenreService(_,{id},{ db }).details();
        }
    }
};
export default resolversGenreQuery;