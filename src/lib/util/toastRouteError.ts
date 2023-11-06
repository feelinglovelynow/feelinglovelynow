import { onMount } from 'svelte'
import type { flnError } from '$lib'
import { goto } from '$app/navigation'
import showToast from '@feelinglovelynow/toast'


export default function toastRouteError (data: any, url?: string) {
  if (data?._errors) {
    onMount(() => {
      showToast('info', data._errors)
      if (url) goto(url)
    })
  }
}
