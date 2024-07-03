'use server'

import path from 'path'
import { access, constants, mkdir, writeFile } from 'node:fs/promises'
import { UploadState, uploadSchema } from '@/lib/validation'
import { flatFieldErrors } from '@/lib/utils'

export async function saveForm(preveState: UploadState, formData: FormData) {
  const map: UploadState = {} as UploadState
  const error = flatFieldErrors(formData, uploadSchema)
  // At first generate form field error meaages like on the client
  // show them under the relevent inputs
  if (Object.keys(error).length > 0) {
    map.error = error
    return map
  }
  // upload with file buffer
  const folder = 'uploads'
  try {
    await access(folder, constants.F_OK)
  } catch (error) {
    try {
      await mkdir(folder)
    } catch (error) {
      map.message = 'Create upload folder failed'
      return map
    }
  }
  try {
    const file = formData.get('picture') as File
    const fileBuffer = await file.arrayBuffer()
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e4)
    const ext = file.name.slice(-4)
    const filename = uniqueName + ext
    const filePath = path.join(folder, filename)
    await writeFile(filePath, Buffer.from(fileBuffer))
    map.data = filePath
  } catch (error) {
    map.message = 'Upload picture failed'
  }
  return map
}
