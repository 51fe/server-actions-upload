'use client'

import { saveForm } from './action'
import { useRef, useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import {
  UploadError,
  UploadValue,
  uploadSchema,
  UploadState
} from '@/lib/validation'
import { SubmitButton } from '@/components/submit-button'
import { useToast } from '@/components/ui/use-toast'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '../components/ui/form'
import { upLoadImg } from './config'

export function HookForm() {
  const [message, setMessage] = useState('')
  const [data, setData] = useState('')
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const form = useForm<UploadValue>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      name: '',
      picture: undefined
    }
  })

  const { control, handleSubmit, setError } = form

  const onSubmit: SubmitHandler<UploadValue> = async (_values, event) => {
    startTransition(async () => {
      const { error, message, data } = await saveForm(
        {} as UploadState,
        new FormData(event?.target)
      )

      for (const key in error) {
        const k = key as keyof UploadError
        setError(k, {
          message: error[k]
        })
      }

      if (!!data) {
        setData(data)
        toast({
          title: 'Succeed',
          description: 'Save succeed',
          variant: 'success'
        })
        form.reset()
        formRef.current?.reset()
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
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="picture"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Picture</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept={upLoadImg.formats}
                  placeholder="Picture"
                  onChange={(event) =>
                    onChange(event.target.files && event.target.files[0])
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <SubmitButton pending={isPending} description="Submit the form">
            Save Form
          </SubmitButton>
        </div>
        <div aria-live="polite" role="status" className="sr-only">
          {message && <div className="text-destructive">{message}</div>}
          {data && <div className="text-green-500">Save succeed</div>}
        </div>
      </form>
    </Form>
  )
}
