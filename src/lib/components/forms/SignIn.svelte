<script lang="ts">
  import { onMount } from 'svelte'
  import showToast from '@feelinglovelynow/toast'
  import Title from '$lib/components/Title.svelte'
  import Button from '$lib/components/forms/Button.svelte'

  let email: string
  let isLoading: boolean
  let removeToast: () => void

  onMount(() => {
    return () => { // on unmount (aka on page transition)
      if (removeToast) removeToast() // remove the success toast
    }
  })

  async function signIn () {
    isLoading = true

    const rFetch = await fetch('/auth/verify-sign-in', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' }
    })

    const r = await rFetch.json()

    if (r?._errors?.length) showToast('info', r._errors)
    else if (!r?.href) removeToast = showToast('success', 'Success!') // define removeToast so we may removeToast on unmount
    else {
      const linkId = crypto.randomUUID()
      const spinId = crypto.randomUUID()

      const html = `
        <div style="position: relative; display: flex;">
          <div class="fln__pr-text">Success!</div>
          <div style="position: relative;">
            <a id="${ linkId }" style="position: relative; opacity: 1; transition: all 0.3s;" href="${ r.href }">Sign In Link</a>
            <div id="${ spinId }" style="opacity: 0; transition: all 0.3s; position: absolute; top: 0; left: 50%; margin-left: -15px; z-index: -1;" class="fln__simple-load brand">
              <div class="fln__simple-load__wheel"></div>
            </div>
          </div>
        <div>
      `

      setTimeout(() => {// wait for toast to be in DOM
        const link = document.getElementById(linkId)
        const spin = document.getElementById(spinId)

        if (link && spin) {
          link.addEventListener('click', () => { // on link in toast click => show spinner and hide link
            link.style.opacity = '0'
            link.style.zIndex = '-1'
            spin.style.opacity = '1'
            spin.style.zIndex = '1'
          })
        }
      })

      removeToast = showToast('success', html) // define removeToast so we may removeToast on unmount
    }

    isLoading = false
  }
</script>


<Title text="Welcome Admin!" noBottom={ true } />
<section>
  <form on:submit|preventDefault={ signIn }>
    <div class="form-item">
      <label for="email">Email</label>
      <input bind:value={ email } name="email" type="email" class="brand"/>
    </div>
    <Button { isLoading } type="submit" text="Enter" />
  </form>
</section>



<style lang="scss">
  section {
    width: 45rem;
    max-width: 96vw;
  }
</style>
