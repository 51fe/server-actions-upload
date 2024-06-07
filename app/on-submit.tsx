'use client'

import { saveForm } from './action'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/submit-button'
import { FormEvent, useRef, useState, useTransition } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { flatFieldErrors } from '@/lib/utils'
import { UploadError, UploadState, uploadSchema } from '@/lib/validation'
import { upLoadImg } from './config'

export default function UploadForm() {
  const [error, setError] = useState<UploadError>()
  const [message, setMessage] = useState('')
  const [data, setData] = useState('')
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const form = useRef<HTMLFormElement>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError({})
    const formData = new FormData(event.currentTarget)
    const err = flatFieldErrors(uploadSchema, formData)
    setError(err)
    if (Object.keys(err).length > 0) {
      return
    }

    startTransition(async () => {
      const { error, message, data } = await saveForm(
        {} as UploadState,
        formData
      )
      setError(error)
      if (data) {
        setData(data)
        toast({
          title: 'Succeed',
          description: 'Save succeed.',
          variant: 'succees'
        })
        form.current?.reset()
      } else if (message) {
        setMessage(message)
        toast({
          title: 'Something went wrong.',
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
          <div aria-live="polite" className="text-destructive">
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
      {error && <div className="text-destructive">{error.picture}</div>}
      <div className="space-y-2">
        <SubmitButton pending={isPending} description="Submit the form">
          Save Form
        </SubmitButton>
      </div>
      <div className="space-y-2">
        {message && <div className="text-destructive">{message}</div>}
        {data && <div className="text-green-500">Save Succeed</div>}
      </div>
    </form>
  )
}
