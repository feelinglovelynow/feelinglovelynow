export type SourceType = 'science' | 'culture' | 'product' | undefined


export type Source = {
  id: string
  slug: string
  description?: string
  type: SourceType
  title: string
  authors: Author[]
  quotes: Quote[]
  categories?: Category[]
  url: string
  urlType: 'academia' | 'pubmed' | 'youtube' | 'pdf' | 'heartmath' | 'scribd' | 'soundcloud' | 'internet'
  publicationLocation: string
  publicationYear: number
  images?: Image[]
}

export type Author = {
  id?: string
  slug: string
  name: string
  lowName?: string
  href?: string
}

export type Quote = {
  id?: string
  text: string
  displayOrder: number
  categories: Category[]
}

export type Category = {
  id?: string
  slug: string
  name: string
  lowName?: string
  href?: string
}

export type Image = {
  id: string
  src?: string
  displayOrder: int
  extension: 'png' | 'webp'
}

export type Product = {
  id: string
  slug: string
  printfulId?: string
  name: string
  description?: string
  images: Image[]
  displayOrder: int
  showFlowerMetatronMerkaba: boolean
  categories: Category[]
}
