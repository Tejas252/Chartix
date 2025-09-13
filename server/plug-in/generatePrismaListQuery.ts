import { prisma } from "@/lib/prisma"
import { createConnectionArgs, getWhere } from "./misc"
import { PrismaClient } from "@/prisma/generated/client"
import { Session } from "@clerk/nextjs/server"


export interface AuthScopes {
    isAuthenticated?: boolean
}

// plugins/crudQueryBuilder.ts
export const generatePrismaListQuery = ({
    t,
    typeName,
    modelName,
    searchableField = ['name'],
    defaultSortField = 'createdAt',
    filterFields = null,
    orderByFields = null,
    authScopes  ,
    defaultFilters = (ctx: any) => ({}),
    getFilters
}: {
    t: any
    typeName: string
    modelName: keyof PrismaClient;
    searchableField?: string[]
    defaultSortField?: string
    filterFields?: any
    orderByFields?: any
    authScopes?: AuthScopes,
        defaultFilters?: (ctx: any) => Record<string, unknown>,
        getFilters?: (t: any) => any,
}) => {
    return t.prismaConnection({
        type: typeName,
        cursor: 'id',
        authScopes: authScopes,
        totalCount: (parent: unknown, args: { search?: string; filter?: Record<string, unknown> }, ctx: {me: Session}) => {

            return (prisma[modelName] as any).count({
                where: {
                    ...(args.search
                        ? getWhere(searchableField, args.search)
                        : {}),
                    // ...args.filter,
                    ...(defaultFilters?.(ctx) || {}),
                    ...(args?.ignore?.length ? { id: { notIn: args?.ignore } } : {}),
                     ...(filterFields && getFilters  ? getFilters(args?.filter) : args.filter)
                }
            })
        },
        args: {
            ...createConnectionArgs(t),
            ignore: t.arg.intList(),
            search: t.arg.string(),
            sortBy: t.arg({ type: orderByFields || 'String' }),
            ...(filterFields ? { filter: t.arg({ type: filterFields }) } : {}),
        },
        resolve: async (query: { take: number; skip: number }, parent: unknown, args: { ignore?: number[], search?: string; filter?: Record<string, unknown>; sortBy?: string }, ctx: { me: Session }) => {
            const where = {
                ...(args.search
                    ? getWhere(searchableField, args.search)
                    : {}),
                // ...args.filter,
                ...(defaultFilters?.(ctx) || {}),
                ...(args?.ignore?.length ? { id: { notIn: args?.ignore } } : {}),
                ...(filterFields && getFilters  ? getFilters(args?.filter) : args.filter)
            }

            // @ts-ignore
            return prisma[modelName]?.findMany({
                ...query,
                where,
                orderBy: args.sortBy ? { [args.sortBy]: 'asc' } : { [defaultSortField]: 'desc' },
            })
        },
    })
}
