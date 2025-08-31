import builder from "@/lib/pothos-builder";
import "./chat/chat.resolver";

export default function buildAllGraphqlSchema() {
    return builder.toSchema()
}