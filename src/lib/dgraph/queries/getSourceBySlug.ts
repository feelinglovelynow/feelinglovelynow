const getSourceBySlug = `
  query MyQuery {
    getSource(slug: "") {
      quotes(order: {asc: displayOrder}) {
        id
        displayOrder
        text
      }
    }
  }
`