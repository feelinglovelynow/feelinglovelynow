<script lang="ts">
  import schema from '$lib/zod/emailUs'
  import Title from '$lib/components/Title.svelte'
  import Form from '$lib/components/forms/Form.svelte'
  import type { FormInputs, FormToastOnSuccess } from '$lib'

  const inputs: FormInputs = [
    [
      { name: 'firstName', label: 'First Name' },
      { name: 'lastName', label: 'Last Name' },
    ],
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'comment', label: 'Comment', type: 'textarea' }
  ]

  const toastOnSuccess = (({ fields }) => `Thank you for your comment ${ fields.firstName.toString() }!`) satisfies FormToastOnSuccess
</script>


<Title text="Will email ya back!" noBottom={ true } />
<Form { inputs } { schema } { toastOnSuccess } action="emailUs" />
