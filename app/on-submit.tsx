'use client'

import { saveForm } from './action'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/submit-button'
import { FormEvent, useRef, useState, useTransition } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { flatFieldErrors } from '@/lib/utils'
import { UploadError, UploadState, uploadSchema } from '@/lib/validation'
import { upLoadImg } from './config'

export function SubmitForm() {
  const [error, setError] = useState<UploadError>()
  const [message, setMessage] = useState('')
  const [data, setData] = useState('')
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const form = useRef<HTMLFormElement>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const err = flatFieldErrors(formData, uploadSchema)
    setError(err)
    if (Object.keys(err).length > 0) {
      return
    }

    startTransition(async () => {
      const { error, message, data } = await saveForm(
        {} as UploadState,
        formData
      )
      if (!!error) {
        setError(error)
      }
      if (!!data) {
        setData(data)
        toast({
          title: 'Succeed',
          description: 'Save succeed',
          variant: 'success'
        })
        form.current?.reset()
      } else if (!!message) {
        setMessage(message)
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive'
        })
      }
    })
  }

  return (
    <form onSubmit={onSubmit} ref={form} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Name" />
        {error && (
          <div role="alert" className="text-destructive">
            {error.name}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="picture">Picture</Label>
        <Input
          type="file"
          id="picture"
          name="picture"
          accept={upLoadImg.formats}
          placeholder="Picture"
        />
      </div>
      {error && (
        <div role="alert" className="text-destructive">
          {error.picture}
        </div>
      )}
      <div className="space-y-2">
        <SubmitButton pending={isPending} description="Submit the form">
          Save Form
        </SubmitButton>
      </div>
      <div aria-live="polite" role="status" className="sr-only">
        {message && <div className="space-y-4 text-destructive">{message}</div>}
        {data && <div className="space-y-4 text-green-500">Save Succeed</div>}
      </div>
    </form>
  )
}
