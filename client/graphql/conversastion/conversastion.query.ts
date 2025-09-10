import { gql } from "@apollo/client";

export const GET_CONVERSATIONS = gql`query GetConversations {
  getConversations {
    createdAt
    id
    title
    file {
      name
    }
  }
}`