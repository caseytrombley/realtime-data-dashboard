declare module '@apollo/server/express4' {
    import { ApolloServer } from '@apollo/server';
    import { RequestHandler } from 'express';

    export function expressMiddleware<TContext>(
        server: ApolloServer<TContext>,
        options?: {
            context?: (args: { req: any }) => Promise<TContext> | TContext;
        }
    ): RequestHandler;
}
