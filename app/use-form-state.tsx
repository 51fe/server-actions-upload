'use client'

import { useToast } from '@/components/ui/use-toast'
import { useFormState, useFormStatus } from 'react-dom'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { saveForm } from './action'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'
import { UploadState } from '@/lib/validation'
import { upLoadImg } from './config'

export function ActionForm() {
  const [state, dispatch] = useFormState(saveForm, {} as UploadState)
  const { error, message, data } = state
  const { toast } = useToast()
  const form = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!!data) {
      toast({
        title: 'Succeed',
        description: 'Save succeed',
        variant: 'success'
      })
      form.current?.reset()
    } else if (!!message) {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      })
    }
  }, [message, data, toast])

  return (
    <form action={dispatch} ref={form} className="space-y-8">
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
        <SubmitButton />
      </div>
      <div aria-live="polite" role="status" className="sr-only">
        {message && <div className="space-y-4 text-destructive">{message}</div>}
        {data && <div className="space-y-4 text-green-500">Save Succeed</div>}
      </div>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2Icon
            className="mr-2 size-4 animate-spin"
            aria-hidden="true"
          />
          <span>Pending...</span>
        </>
      ) : (
        <>Save Form</>
      )}
    </Button>
  )
}
