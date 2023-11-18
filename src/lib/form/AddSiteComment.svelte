<script lang="ts">
  import Form from '$lib/form/Form.svelte'
  import Title from '$lib/global/Title.svelte'
  import showToast from '@feelinglovelynow/toast'
  import type { FormInputs, FormOnSuccess } from '$lib'
  import { schemaAddSiteComment } from '$lib/zod/addSiteComent'

  const inputs: FormInputs = [
    [
      { name: 'firstName', label: 'First Name' },
      { name: 'lastName', label: 'Last Name' },
    ],
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'comment', label: 'Comment', type: 'textarea' }
  ]

  const onSuccess = (({ fields }) => {
    showToast('success', `Thanks for your comment ${ fields.firstName.toString() }!`)
  }) satisfies FormOnSuccess
</script>


<Title text="Will email ya back!" noBottom={ true } />
<Form { inputs } { onSuccess } schema={ schemaAddSiteComment } resetOnSuccess={ true } css="glow" endpoint="/add-site-comment" />
