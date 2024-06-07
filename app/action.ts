'use server'

import path from 'path'
import { writeFile } from 'fs/promises'
import { UploadState, uploadSchema } from '@/lib/validation'
import { flatFieldErrors } from '@/lib/utils'

export async function saveForm(preveState: UploadState, formData: FormData) {
  const map: UploadState = {} as UploadState
  const error = flatFieldErrors(uploadSchema, formData)
  // At first generate form field error meaages like on the client
  // show them under the relevent inputs
  if (Object.keys(error).length > 0) {
    map.error = error
    return map
  }

  try {
    // upload with files buffer
    const file = formData.get('picture') as File
    try {
      const fileBuffer = await file.arrayBuffer()
      const filename = `${Date.now()}-${file.name}`
      const filePath = path.join('./public', filename)
      await writeFile(filePath, Buffer.from(fileBuffer))
      map.data = filename
    } catch (error) {
      map.message = 'upload picture failed'
    }
  } catch (error) {
    map.message = 'save failed'
  }
  return map
}
