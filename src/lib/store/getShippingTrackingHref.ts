import { enumShippingCarrier } from '$lib/util/enums'


export default function getShippingTrackingHref (shippingCarrier: enumShippingCarrier, shippingTrackingId: string) {
  switch (shippingCarrier) {
    case enumShippingCarrier.FED_EX: return `https://www.fedex.com/fedextrack/?trknbr=${ shippingTrackingId }`
    case enumShippingCarrier.USPS: return `https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=${ shippingTrackingId }`
  }
}
