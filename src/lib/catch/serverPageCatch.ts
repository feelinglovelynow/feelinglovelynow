import getCatchResponse from '$lib/catch/getCatchResponse'


export default (e: any) => {
  console.error('ERROR @ $lib > catch > serverPageCatch.ts', e)
  return getCatchResponse(e, 'We apologize, there is an error with this url, please try again and/or <a href="/contact">contact us</a>')
}
