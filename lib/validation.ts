import { upLoadImg } from '@/app/config'
import { z } from 'zod'

export const uploadSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required'
    })
    .min(6, {
      message: 'Name must be at least 6 characters'
    }),

  picture: z
    .instanceof(File, { message: 'Please select a image' })
    .refine((file) => file.size > 0, 'Please select a image')
    .refine((file) => file?.size < upLoadImg.size * 1024 * 1024, {
      message: `Max file size is ${upLoadImg.size} MB`
    })
    .refine((file) => upLoadImg.formats.includes(file.type.slice(-3)), {
      message: `Only support ${upLoadImg.formats}`
    })
})

export type UploadValue = z.infer<typeof uploadSchema>
export type UploadError = {
  [K in keyof UploadValue]?: string
}
export type UploadState = {
  error?: UploadError
  message?: string
  data?: string
}
