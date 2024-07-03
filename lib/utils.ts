import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ZodSchema, z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function flatFieldErrors(formData: FormData, formSchema: ZodSchema) {
  type T = z.infer<typeof formSchema>
  type FieldError = {
    [K in keyof T]: string
  }
  const err: FieldError = {}
  const resullt = formSchema.safeParse(Object.fromEntries(formData))

  // Return early if the form data is invalid
  if (resullt.success === false) {
    const errors = resullt.error.flatten().fieldErrors
    for (const [k, v] of Object.entries(errors)) {
      err[k] = v![0]
    }
  }
  return err
}
