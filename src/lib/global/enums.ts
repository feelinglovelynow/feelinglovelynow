// https://stackoverflow.com/a/44145644/1549471

export enum enumSourceType {
  science = 'science',
  culture = 'culture',
  product = 'product'
}

export enum enumSourceUrlType {
  academia = 'academia',
  pubmed = 'pubmed',
  youtube = 'youtube',
  pdf = 'pdf',
  heartmath = 'heartmath',
  scribd = 'scribd',
  soundcloud = 'soundcloud',
  internet = 'internet'
}

export enum enumImageExtension {
  png = 'png',
  webp = 'webp'
}

export enum enumProductDescription {
  HEART_LIGHT = 'HEART_LIGHT',
  TORUS = 'TORUS',
  LOTUS = 'LOTUS',
  EMOTIONS = 'EMOTIONS',
  MERKABA = 'MERKABA',
  FLOWER_OF_LIFE = 'FLOWER_OF_LIFE',
  METATRONS_CUBE = 'METATRONS_CUBE',
  UNITY = 'UNITY',
  SEED_OF_LIFE = 'SEED_OF_LIFE',
  WHO_AM_I = 'WHO_AM_I',
}

export enum enumOrderItemSize {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL'
}

export enum enumOrderItemStatus {
  PURCHASED = 'PURCHASED',
  PRINTFUL_PROCESSING = 'PRINTFUL_PROCESSING',
  SHIPPING_TO_CUSTOMER = 'SHIPPING_TO_CUSTOMER',
  DELIVERED_TO_CUSTOMER = 'DELIVERED_TO_CUSTOMER',
  RETURN_REQUESTED = 'RETURN_REQUESTED',
  REFUND_MONEY_PROCESSING = 'REFUND_MONEY_PROCESSING',
  REFUNDED = 'REFUNDED'
}

export enum enumShippingCarrier {
  FED_EX = 'FED_EX',
  USPS = 'USPS',
  LATVIAN_POSTAL_SERVICES = 'LATVIAN_POSTAL_SERVICES',
}

export enum enumTokenType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  SIGN_IN = 'SIGN_IN'
}

export enum enumTheme {
  light = 'light',
  dark = 'dark'
}

export enum enumCacheKey {
  sources = 'sources',
  products = 'products'
}
