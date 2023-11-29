import { one } from '@feelinglovelynow/svelte-catch'


export default function getId (url: string) {
  const splitKey = url.includes('be/') ? 'be/' : '='
  const split =  url.split(splitKey)

  if (split.length !== 2 || split[1].length !== 11) throw one('Please provide a valid url, eg: https://www.youtube.com/watch?v=3G4kCi_ldr8 OR https://youtu.be/3G4kCi_ldr8', { url })
  else return split[1]
}
