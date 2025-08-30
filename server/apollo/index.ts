import builder from "@/lib/pothos-builder";

export default function buildAllGraphqlSchema() {
    return builder.toSchema()
}