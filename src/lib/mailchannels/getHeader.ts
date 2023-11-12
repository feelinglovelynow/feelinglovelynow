import IMG_EMAIL_HEAD from '$lib/img/email/IMG_EMAIL_HEAD.png'


export default function getHeader (): string {
  return `
    <div style="height: 90px; width: 100%; text-align: center;">
      <img style="width: 280px; padding-right: 15px;" src="https://feelinglovelynow.com${ IMG_EMAIL_HEAD }" alt="logo" />
    </div>
  `
}
