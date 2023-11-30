<script lang="ts">
  import { onMount } from 'svelte'
  import Form from '$lib/form/Form.svelte'
  import Title from '$lib/global/Title.svelte'
  import { showToast } from '@feelinglovelynow/toast'
  import type { FormInputs, FormOnSuccess } from '$lib'
  import { schemaVerifySignIn } from '$lib/zod/verifySignIn'

  let removeToast: () => void

  onMount(() => {
    return () => { // on unmount (aka on page transition)
      if (removeToast) removeToast() // remove the success toast
    }
  })

  const inputs: FormInputs = [
    { name: 'email', label: 'Email', type: 'email' },
  ]

  const onSuccess = (({ r }) => {
    if (!r?.href) removeToast = showToast('success', 'Success! Check your email inbox for a sign in link please!') // define removeToast so we may removeToast on unmount
    else {
      const linkId = crypto.randomUUID()
      const loadId = crypto.randomUUID()

      const html = `
        <div style="position: relative; display: flex;">
          <div class="fln__pr-text">Success!</div>
          <div style="position: relative;">
            <a id="${ linkId }" style="position: relative; opacity: 1; transition: all 0.3s;" href="${ r.href }">Sign In Link</a>
            <div id="${ loadId }" style="opacity: 0; transition: all 0.3s; position: absolute; top: 0; left: 50%; margin-left: -15px; z-index: -1;" class="fln__circle-load"></div>
          </div>
        <div>
      `

      setTimeout(() => {// wait for toast to be in DOM
        const link = document.getElementById(linkId)
        const spin = document.getElementById(loadId)

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
  }) satisfies FormOnSuccess
</script>


<Title text="Welcome Admin!" noBottom={ true } />
<div class="sign-in">
  <Form { inputs } schema={ schemaVerifySignIn } { onSuccess } css="glow" endpoint="/auth/verify-sign-in" buttonText="Enter" />
</div>


<style lang="scss">
  :global(.sign-in section) {
    width: 45rem;
    max-width: 96vw;
  }
</style>
