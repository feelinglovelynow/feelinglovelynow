import { z } from 'zod'


export const schemaSearch = z
  .object({
    isQuotesChecked: z.any().optional(), // allow .superRefine() to do the validation
    isSourcesByTitleChecked: z.any().optional(), // allow .superRefine() to do the validation
    isSourcesByDescriptionChecked: z.any().optional(), // allow .superRefine() to do the validation
    query: z.string().min(3, 'Query is at least 3 characters please'),
  })
  .superRefine(({ isQuotesChecked, isSourcesByTitleChecked, isSourcesByDescriptionChecked }, ctx) => {
    if (!isQuotesChecked && !isSourcesByTitleChecked && !isSourcesByDescriptionChecked) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select atleast one checkbox please' })
  })


export type SchemaSearch = z.infer<typeof schemaSearch>
