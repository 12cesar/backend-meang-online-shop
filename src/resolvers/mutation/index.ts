import GMR from 'graphql-merge-resolvers';
import resolversGenreMutation from './genre';
import resolversPlatformMutation from './platform';
import resolversTagMutation from './tag';
import resolversUserMutation from './user';

const mutationResolvers=GMR.merge([
    resolversUserMutation,
    resolversGenreMutation,
    resolversTagMutation,
    resolversPlatformMutation
]);

export default mutationResolvers;