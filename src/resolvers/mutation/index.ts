import GMR from 'graphql-merge-resolvers';
import resolversMailMutation from './email';
import resolversGenreMutation from './genre';
import resolversPlatformMutation from './platform';
import resolversTagMutation from './tag';
import resolversUserMutation from './user';

const mutationResolvers=GMR.merge([
    resolversUserMutation,
    resolversGenreMutation,
    resolversTagMutation,
    resolversPlatformMutation,
    resolversMailMutation
]);

export default mutationResolvers;