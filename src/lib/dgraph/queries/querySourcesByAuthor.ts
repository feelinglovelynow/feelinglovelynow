const querySourcesByAuthor = `
  query MyQuery {
    queryAuthor(filter: {slug: {eq: "rollin-mccraty-phd"}}) {
      sources {
        id
        title
        authors {
          name
        }
      }
    }
  }
`