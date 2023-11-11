import type { Category, Source } from '$lib'


export default function formatScience (source?: Source): Source | undefined {
  if (source?.quotes) {
    const categoryMap = new Map<string, Category>()

    for (const quote of source.quotes) {
      for (const category of quote.categories) {
        categoryMap.set(category.slug, category)
      }
    }

    source.categories = [...categoryMap.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name))
  }

  return source
}
