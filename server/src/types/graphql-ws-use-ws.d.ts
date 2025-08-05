declare module 'graphql-ws/lib/use/ws' {
    import type { WebSocketServer } from 'ws';

    export function useServer(options: any, server: WebSocketServer): void;
}
