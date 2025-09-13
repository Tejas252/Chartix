import builder from "@/lib/pothos-builder";
import "./chat/chat.resolver";
import "../plug-in/index"

export default function buildAllGraphqlSchema() {
    return builder.toSchema()
}