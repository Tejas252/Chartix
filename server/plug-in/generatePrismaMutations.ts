import {prisma} from "@/lib/prisma"
import { GraphQLError } from "graphql"

interface MutationConfig {
    t: any
    typeName: string
    modelName: string
    createInput?: any
    updateInput?: any
    requiredFields?: string[]
    allowedOperations?: ('create' | 'update' | 'delete')[]
}

export const generatePrismaCreateMutation = ({
    t,
    typeName,
    modelName,
    createInput,
    requiredFields = [],
}: {
    t: any
    typeName: string
    modelName: string
    createInput: any
    requiredFields?: string[]
}) => {
    return t.prismaField({
        type: typeName,
        args: {
            input: t.arg({ type: createInput, required: true }),
        },
        resolve: async ( query: Record<string, unknown>, parent: unknown, args: { input: Record<string, unknown> }, ctx: unknown ) => {
            try {
                console.log(`Creating ${modelName}:`, JSON.stringify(args.input, null, 2));
                
                // Validate required fields
                for (const field of requiredFields) {
                    if (!args.input[field]) {
                        throw new GraphQLError(`Field '${field}' is required`)
                    }
                }

                // Extract only the select/include parts from query, not other fields
                const { select, include } = query;
                const queryOptions: any = {};
                if (select) queryOptions.select = select;
                if (include) queryOptions.include = include;

                // @ts-ignore
                const result = await prisma[modelName].create({
                    ...queryOptions,
                    data: args.input,
                })

                console.log(`Created ${modelName}:`, result.id);
                return result
            } catch (error: any) {
                console.error(`Error creating ${modelName}:`, error);
                throw new GraphQLError(`Failed to create ${modelName}: ${error.message}`)
            }
        },
    })
}

export const generatePrismaUpdateMutation = ({
    t,
    typeName,
    modelName,
    updateInput,
}: {
    t: any
    typeName: string
    modelName: string
    updateInput: any
}) => {
    return t.prismaField({
        type: typeName,
        args: {
            id: t.arg.id({ required: true }),
            input: t.arg({ type: updateInput, required: true }),
        },
        resolve: async ( query: Record<string, unknown>, parent: unknown, args: { id: string; input: Record<string, unknown> }, ctx: unknown ) => {
            try {
                console.log(`Updating ${modelName} ${args.id}:`, JSON.stringify(args.input, null, 2));
                
                // Check if record exists
                const existingRecord = await (prisma as any)[modelName].findUnique({
                    where: { id: args.id },
                })
                
                if (!existingRecord) {
                    throw new GraphQLError(`${typeName} with id ${args.id} not found`)
                }

                // Extract only the select/include parts from query
                const { select, include } = query;
                const queryOptions: any = {};
                if (select) queryOptions.select = select;
                if (include) queryOptions.include = include;

                // @ts-ignore
                const result = await prisma[modelName].update({
                    ...queryOptions,
                    where: { id: args.id },
                    data: args.input,
                })

                console.log(`Updated ${modelName}:`, result.id);
                return result
            } catch (error: any) {
                console.error(`Error updating ${modelName}:`, error);
                throw new GraphQLError(`Failed to update ${modelName}: ${error.message}`)
            }
        },
    })
}

export const generatePrismaDeleteMutation = ({
    t,
    typeName,
    modelName,
}: {
    t: any
    typeName: string
    modelName: string
}) => {
    return t.prismaField({
        type: typeName,
        args: {
            id: t.arg.id({ required: true }),
        },
        resolve: async (query: Record<string, unknown>, parent: unknown, args: { id: string }, ctx: unknown) => {
            try {
                console.log(`Deleting ${modelName} ${args.id}`);
                
                // Extract only the select/include parts from query
                const { select, include } = query;
                const queryOptions: any = {};
                if (select) queryOptions.select = select;
                if (include) queryOptions.include = include;
                
                // Check if record exists
                // @ts-ignore
                const existingRecord = await prisma[modelName].findUnique({
                    ...queryOptions,
                    where: { id: args.id },
                })
                
                if (!existingRecord) {
                    throw new GraphQLError(`${typeName} with id ${args.id} not found`)
                }

                // @ts-ignore
                await prisma[modelName].delete({
                    where: { id: args.id },
                })

                console.log(`Deleted ${modelName}:`, args.id);
                return existingRecord
            } catch (error: any) {
                console.error(`Error deleting ${modelName}:`, error);
                throw new GraphQLError(`Failed to delete ${modelName}: ${error.message}`)
            }
        },
    })
}

export const generatePrismaCrudMutations = (config: MutationConfig) => {
    const mutations: any = {}
    const { t, typeName, modelName, allowedOperations = ['create', 'update', 'delete'] } = config

    if (allowedOperations.includes('create') && config.createInput) {
        mutations[`create${typeName}`] = generatePrismaCreateMutation({
            t,
            typeName,
            modelName,
            createInput: config.createInput,
            requiredFields: config.requiredFields,
        })
    }

    if (allowedOperations.includes('update') && config.updateInput) {
        mutations[`update${typeName}`] = generatePrismaUpdateMutation({
            t,
            typeName,
            modelName,
            updateInput: config.updateInput,
        })
    }

    if (allowedOperations.includes('delete')) {
        mutations[`delete${typeName}`] = generatePrismaDeleteMutation({
            t,
            typeName,
            modelName,
        })
    }

    return mutations
}