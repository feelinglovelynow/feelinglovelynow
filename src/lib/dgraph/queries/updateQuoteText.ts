const getQuoteById = `
  mutation MyMutation {
    updateQuote(input: {filter: {id: ""}, set: {text: ""}}) {
      quote {
        id
        displayOrder
        text
      }
    }
  }
`
