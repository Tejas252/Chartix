// mutations/index.ts
import PrismaTypes from "@/pothos/plugin-prisma/generated"

interface MutationConfig {
    typeName: keyof PrismaTypes
    modelName: string
    createInput?: any
    updateInput?: any
    requiredFields?: string[]
    allowedOperations?: ('create' | 'update' | 'delete')[]
}

export const mutationConfigs: MutationConfig[] = [
    
]

