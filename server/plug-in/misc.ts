// import builder from "@/lib/pothos-builder";

export const createConnectionArgs = (t: any) => ({
    first: t.arg.int(),
    last: t.arg.int(),
    before: t.arg.string(),
    after: t.arg.string(),
})

// builder.inputType('SortInput', {
//     fields: (t) => ({
//         sortField: t.string({ required: false }),
//         sortOrder: t.string({ required: false })
//     })
// });

export const createPaginationAndSortArgs = (t: any) => ({
    take: t.arg.int({ required: false, defaultValue: 10 }),
    skip: t.arg.int({ required: false, defaultValue: 0 }),
     sort: t.arg({
        type: 'SortInput',
        required: false
    })
})

export const getPaginationAndSort = (args: any) => {
    const { take = 10, skip = 0, sort } = args;
    
    const sortField = sort?.sortField || 'createdAt';
    const sortOrder = sort?.sortOrder || 'desc';

    const orderBy = {
        [sortField]: sortOrder
    };
    
    return {
        take,
        skip,
        orderBy
    };
}

export const getOrderBy = (field: string, direction: 'asc' | 'desc' = 'desc') => ({
    [field]: direction,
})

export const getWhere = (searchableField: string[], search: string) => {
    if (!search) {
        return {}
    }

    return {
        OR: searchableField.map((field) => {
            // Check if field contains a relation (denoted by .)
            if (field.includes('.')) {
                const [relation, relationField] = field.split('.')
                return {
                    [relation]: {
                        [relationField]: {
                            contains: search,
                            mode: 'insensitive',
                        }
                    }
                }
            }

            // Regular field without relation
            return {
                [field]: {
                    contains: search,
                    mode: 'insensitive',
                }
            }
        }).filter(Boolean),
    }
}