import { enumShippingCarrier } from '$lib/global/enums'


export default function getShippingTrackingHref (shippingCarrier: string, shippingTrackingId: string) {
  switch (shippingCarrier) {
    case enumShippingCarrier.FED_EX: return `https://www.fedex.com/fedextrack/?trknbr=${ shippingTrackingId }`
    case enumShippingCarrier.USPS: return `https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=${ shippingTrackingId }`
    case enumShippingCarrier.LATVIAN_POSTAL_SERVICES: return `https://t.17track.net/en#nums=${ shippingTrackingId }`
  }
}
