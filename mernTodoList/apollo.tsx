import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
	uri: 'http://192.168.86.58:4000/graphql',
	cache: new InMemoryCache(),
});
