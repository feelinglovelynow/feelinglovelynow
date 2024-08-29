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
    const rShowToast = showToast('success', 'Success! Check your email inbox for a sign in link please!')
    removeToast = rShowToast.removeToast // define removeToast so we may removeToast on unmount
  }) satisfies FormOnSuccess
</script>


<Title text="Welcome Admin!" noBottom={ true } />
<div class="sign-in">
  <Form { inputs } schema={ schemaVerifySignIn } { onSuccess } css="glow" endpoint="/auth/verify-sign-in" buttonText="Enter" />
</div>


<style lang="scss">
  .sign-in {
    position: relative;
    z-index: 1;
  }

  :global(.sign-in section) {
    width: 45rem;
    max-width: 96vw;
  }
</style>
