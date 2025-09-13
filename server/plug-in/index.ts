import builder from "@/lib/pothos-builder"
import { AuthScopes, generatePrismaListQuery } from "./generatePrismaListQuery"
import PrismaTypes from "@/pothos/plugin-prisma/generated"
import {  PrismaClient } from "@/prisma/generated/client"
import { Session } from "@clerk/nextjs/server"
import { createConnectionArgs } from "./misc"
import { prisma } from "@/lib/prisma"
// import { generatePrismaCrudMutations } from "./generatePrismaMutations"
// import { mutationConfigs } from "./mutations"

interface ListQueryConfig {
    name: string
    typeName: keyof PrismaTypes
    modelName: string
    searchableField: string[]
    defaultSortField: string
    filterFields?: any
    orderByFields?: any
    authScopes?: AuthScopes
    defaultFilters?: (ctx: { me: Session }) => Record<string, unknown>,
    getFilters?: (t: any) => any
}

const listQueryConfigs: ListQueryConfig[] = [
{
    name: "conversations",
    typeName: "Conversation",
    modelName: "conversation",
    searchableField: ["title"],
    defaultSortField: "createdAt",
    authScopes: {
        isAuthenticated: true
    },
    defaultFilters: (ctx: { me: Session }) => ({
        userId: ctx.me.id
    })
},
{
    name: "messages",
    typeName: "Message",
    modelName: "message",
    searchableField: ["content"],
    defaultSortField: "createdAt",
    authScopes: {
        isAuthenticated: true
    },
    filterFields: builder.inputType("MessageFilter", {
        fields: (t) => ({
            conversationId: t.id({ required: true }),
        })
    }),
    getFilters: (filters:any) => ({
        conversationId: filters.conversationId
    }),
}
    
]


builder.queryType({
    fields: (t) => {

        const finalConfig = {}
        listQueryConfigs.forEach((config) => (Object.assign(finalConfig, {
            [config.name]: generatePrismaListQuery({
                t,
                typeName: config.typeName,
                modelName: config.modelName as keyof PrismaClient,
                searchableField: config.searchableField,
                defaultSortField: config.defaultSortField,
                authScopes: config.authScopes,
                filterFields: config.filterFields,
                defaultFilters: (ctx: { me: Session }) => config?.defaultFilters?.(ctx),
                getFilters: config?.getFilters
            })
        })))

        return finalConfig
    },
})

// builder.mutationType({
//     fields: (t) => {
//         const finalMutations = {}

//         mutationConfigs.forEach((config) => {
//             const mutations = generatePrismaCrudMutations({
//                 t,
//                 typeName: config.typeName,
//                 modelName: config.modelName,
//                 createInput: config.createInput,
//                 updateInput: config.updateInput,
//                 requiredFields: config.requiredFields,
//                 allowedOperations: config.allowedOperations,
//             })

//             Object.assign(finalMutations, mutations)
//         })

//         return finalMutations
//     },
// })