export type FormFields = {
  [k: string]: FormDataEntryValue
}


export type FormOnSuccess = ({ fields, r }: { fields: FormFields, r: any } ) => void
export type FormToastOnSuccess = ({ fields, data }: { fields: FormFields, data: any }) => string
export type FormOnSubmitValidate = (fields: FormFields) => boolean


export type FormInput = {
  name: string,
  label?: string,
  type?: 'checkbox' | 'email' | 'textarea' | 'text',
  value?: string | null,
  checkboxValue?: boolean,
  hidden?: boolean,
  serverImages?: string[] | null,
  maxWidth?: string,
  focusOnInit?: boolean,
  autocomplete?: string,
  multiple?: boolean,
}


export type FormInputs = Array<FormInput | Array<FormInput>>
