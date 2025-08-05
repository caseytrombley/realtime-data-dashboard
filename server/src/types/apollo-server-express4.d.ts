declare module '@apollo/server/express4' {
    import type { RequestHandler } from 'express';
    import type { ApolloServer } from '@apollo/server';

    // Declare expressMiddleware with its typical signature
    export function expressMiddleware(server: ApolloServer<any>, options?: {
        context?: (params: { req: Request; res: Response }) => any | Promise<any>;
    }): RequestHandler;
}
