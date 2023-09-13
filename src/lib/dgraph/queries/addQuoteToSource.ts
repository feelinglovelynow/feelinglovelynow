const addQuoteToSource = `
  mutation MyMutation($quotes: [QuoteRef] = {}) {
    updateSource(input: {filter: {slug: {eq: ""}}, set: {quotes: $quotes}}) {
      numUids
    }
  }
`