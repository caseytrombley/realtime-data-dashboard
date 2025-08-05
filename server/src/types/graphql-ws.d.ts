declare module 'graphql-ws/lib/use/ws' {
    import { Server } from 'ws';
    import { GraphQLSchema } from 'graphql';

    export interface ServerOptions {
        schema: GraphQLSchema;
        execute?: any;
        subscribe?: any;
        onConnect?: (ctx: any) => void | Promise<void>;
        onDisconnect?: (ctx: any) => void | Promise<void>;
    }

    export function useServer(options: ServerOptions, server: Server): void;
}
