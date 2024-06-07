'use client'

import { saveForm } from './action'
import { useState, useTransition } from 'react'
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

export default function HookForm() {
  const [message, setMessage] = useState('')
  const [data, setData] = useState('')
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const form = useForm<UploadValue>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      name: '',
      picture: undefined
    }
  })

  const { control, handleSubmit, setError } = form

  const onSubmit: SubmitHandler<UploadValue> = async (values: UploadValue) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('picture', values.picture)

      const { error, message, data } = await saveForm(
        {} as UploadState,
        formData
      )

      for (const key in error) {
        const k = key as keyof UploadError
        setError(k, {
          message: error[k]
        })
      }

      if (data) {
        toast({
          title: 'Succeed',
          description: 'Save succeed.',
          variant: 'succees'
        })
        setData(data)
        form.reset()
      } else if (!!message) {
        toast({
          title: 'Something went wrong.',
          description: message,
          variant: 'destructive'
        })
        setMessage(message)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
        <div className="space-y-2">
          {message && <div className="text-destructive m-">{message}</div>}
          {data && <div className="text-green-500">Save Succeed</div>}
        </div>
      </form>
    </Form>
  )
}
