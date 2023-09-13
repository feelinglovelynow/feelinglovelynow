<script lang="ts">
  import schema from '$lib/zod/imageAI'
  import Title from '$lib/components/Title.svelte'
  import Form from '$lib/components/forms/Form.svelte'
  import type { FormInputs, FormToastOnSuccess, FormOnSuccess } from '$lib'

  let src: string

  const inputs: FormInputs = [
    { name: 'description', label: 'Description', type: 'textarea' }
  ]

  const onSuccess = (({ data }) => src = data) satisfies FormOnSuccess
  const toastOnSuccess = (() => `Success`) satisfies FormToastOnSuccess
</script>


<Title text="Image AI" noBottom={ true } />
<Form { inputs } { schema } { toastOnSuccess } { onSuccess } reset={ false } action="imageAI" />

{ #if src }
  <img { src } alt="AI Generated" />
{ /if }
