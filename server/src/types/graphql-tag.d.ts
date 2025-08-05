declare module 'graphql-tag' {
    import { DocumentNode } from 'graphql';
    const gql: (literals: TemplateStringsArray, ...placeholders: any[]) => DocumentNode;
    export default gql;
}
