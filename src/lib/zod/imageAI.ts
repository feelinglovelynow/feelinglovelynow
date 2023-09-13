import { z } from 'zod'


export default z.object({
  description: z.string().min(9, 'Description at least 9 characters please'),
})
