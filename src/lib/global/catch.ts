import { onMount } from 'svelte'
import showToast from '@feelinglovelynow/toast'
import { SvelteCatch, enumCatchLocation } from '$lib/global/svelte-catch'


export function pageServerCatch (e: any) {
  const svelteCatch = new SvelteCatch(enumCatchLocation.pageServer, 'We apologize, there is an error with this page. Please try again and/or <a href="/links">contact us</a>')
  return svelteCatch.catch(e)
}


export function serverCatch (e: any) {
  const svelteCatch = new SvelteCatch(enumCatchLocation.server, 'We apologize, there is an error with this request. Please try again and/or <a href="/links">contact us</a>')
  return svelteCatch.catch(e)
}


export function routeCatch (data: any) {
  if (data?._errors?.length) {
    onMount(() => {
      showToast('info', data._errors)
    })
  }
}
