<script lang="ts">
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import EmailUs from '$lib/components/forms/EmailUs.svelte'
  import IMG_OG_CONTACT from '$lib/img/og/IMG_OG_CONTACT.webp'
  import SocialSupport from '$lib/components/SocialSupport.svelte'
</script>


<Head title="Contact" url="contact" ogImageSrc={ IMG_OG_CONTACT } description="Please feel free to contat us!" />
<Title text="Contact" size="one" />
<SocialSupport />
<EmailUs />
