import GMR from 'graphql-merge-resolvers';
import resolversMailMutation from './email';
import resolversGenreMutation from './genre';
import resolversPlatformMutation from './platform';
import mutationStripeResolvers from './stripe';
import resolversTagMutation from './tag';
import resolversUserMutation from './user';

const mutationResolvers=GMR.merge([
    resolversUserMutation,
    resolversGenreMutation,
    resolversTagMutation,
    resolversPlatformMutation,
    resolversMailMutation,
    mutationStripeResolvers
]);

export default mutationResolvers;