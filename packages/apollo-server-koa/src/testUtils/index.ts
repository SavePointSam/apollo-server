import { HttpLink } from 'apollo-link-http';
import * as Koa from 'koa';
import * as http from 'http';
import fetch from 'node-fetch';
import { AddressInfo } from 'net';
import { execute } from 'apollo-link';
export { toPromise } from 'apollo-link';

import { ApolloServer } from '../';

export const startTestServer = async (server: ApolloServer) => {
  const app = new Koa();
  server.applyMiddleware({ app });
  const httpServer = await new Promise<http.Server>(resolve => {
    const s = app.listen({ port: 0 }, () => resolve(s));
  });

  const link = new HttpLink({
    uri: `http://localhost:${
      (httpServer.address() as AddressInfo).port
    }/graphql`,
    fetch,
  });

  const executeOperation = ({
    query,
    variables = {},
  }: {
    query: any;
    variables: Record<string, any>;
  }) => execute(link, { query, variables });

  return { link, stop: () => httpServer.close(), graphql: executeOperation };
};