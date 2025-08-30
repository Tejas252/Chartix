"use client";
import { ApolloClient, ApolloLink, FetchPolicy, InMemoryCache, createHttpLink } from "@apollo/client"
import { onError } from "@apollo/client/link/error";
import { persistCache } from "apollo-cache-persist";

if (typeof window !== 'undefined') {
  try {
    persistCache({
      cache: new InMemoryCache(),
      storage: window.localStorage, // IF THE API DATA IS TOO LARGE YOU CAN USE INDEXDB //
    } as any);
  } catch (error) {
    console.error('Error restoring Apollo cache', error);
  }
}

const errorLink = onError(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions, path }: any) => {
      if (extensions.code === 'UNAUTHENTICATED') {
        console.log('User is not authenticated==>')
      }
    });
  }
});


const httpLink = createHttpLink({
  uri: '/api/graphql',
  credentials: 'same-origin',
});

const customClient = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: ApolloLink.from([ errorLink, httpLink]),
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-and-network' as FetchPolicy
    }
  },
  cache: new InMemoryCache(),
})

export default customClient