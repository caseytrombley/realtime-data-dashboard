declare module 'graphql-ws/lib/use/ws' {
    import type { WebSocketServer } from 'ws';
    import type { ExecutionArgs, SubscribeArgs } from 'graphql';

    export function useServer(
        options: {
            schema: any;
            onConnect?: (ctx: any) => void;
            onDisconnect?: (ctx: any) => void;
            onSubscribe?: (ctx: any, msg: any) => ExecutionArgs | void;
            onNext?: (ctx: any, msg: any, args: any) => void;
            onError?: (ctx: any, msg: any, errors: any) => void;
            onComplete?: (ctx: any, msg: any) => void;
        },
        server: WebSocketServer
    ): void;
}
