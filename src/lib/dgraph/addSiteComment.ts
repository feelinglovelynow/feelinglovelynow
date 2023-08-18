import type { FormFields } from '$lib'
import graphql from '$lib/dgraph/graphql'


export default async function addSiteComment (fields: FormFields) {
  return graphql({
    query: `
      mutation MyMutation($email: String!, $firstName: String!, $lastName: String!, $createdAt: DateTime!, $comment: String!) {
        addSiteComment(input: {email: $email, firstName: $firstName, lastName: $lastName, createdAt: $createdAt, comment: $comment}) {
          siteComment {
            id
          }
        }
      }
    `,
    variables: {
      email: fields.email.toString(),
      firstName: fields.firstName.toString(),
      lastName: fields.lastName.toString(),
      createdAt: (new Date()).toISOString(),
      comment: fields.comment.toString(),
    }
  })
}
