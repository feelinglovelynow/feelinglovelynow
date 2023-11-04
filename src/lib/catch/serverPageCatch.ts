import getCatchResponse from '$lib/catch/getCatchResponse'


export default function serverPageCatch (e: any) {
  return getCatchResponse(e, 'We apologize, there is an error with this url, please try again and/or <a href="/links">contact us</a>')
}
