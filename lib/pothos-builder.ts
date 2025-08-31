import SchemaBuilder from '@pothos/core';
import { PrismaClient } from '@prisma/client';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin from '@pothos/plugin-relay';
import PrismaUtils from '@pothos/plugin-prisma-utils';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
// This is the default location for the generator, but this can be
// customized as described above.
// Using a type only import will help avoid issues with undeclared
// exports in esm mode
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { GraphQLJSON } from 'graphql-scalars';
import { Context } from '@/types/context';

const prisma = new PrismaClient({});

const builder = new SchemaBuilder<{
    PrismaTypes: PrismaTypes;
    Scalars: {
        JSON: { Input: unknown; Output: unknown }
        DateTime: {
            Input: Date,
            Output: Date,
        }
    };
    Context: Context;
    AuthScopes: {
        isAuthenticated: boolean
    };
}>({
    plugins: [PrismaPlugin, RelayPlugin, PrismaUtils, ScopeAuthPlugin],
    scopeAuth: {
        authScopes: async (context) => (
            console.log("🚀 ~ authScopes: ~ context:", context),
            {
                isAuthenticated: !!context.me?.id,
            }
        ),
    },
    relay: { cursorType: 'String', },
    prisma: {
        client: prisma,
        // defaults to false, uses /// comments from prisma schema as descriptions
        // for object types, relations and exposed fields.
        // descriptions can be omitted by setting description to false
        // exposeDescriptions: boolean | { models: boolean, fields: boolean },
        // use where clause from prismaRelatedConnection for totalCount (defaults to true)
        filterConnectionTotalCount: true,
        exposeDescriptions: true,
        // warn when not using a query parameter correctly
        onUnusedQuery: process.env.NODE_ENV === 'production' ? null : 'warn',
    },
});

export default builder;