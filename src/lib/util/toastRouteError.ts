import { onMount } from 'svelte'
import { goto } from '$app/navigation'
import showToast from '@feelinglovelynow/toast'


export default (data: any, url?: string) => {
  if (data?._errors) {
    onMount(() => {
      showToast({ type: 'info', items: data._errors })
      if (url) goto(url)
    })
  }
}
