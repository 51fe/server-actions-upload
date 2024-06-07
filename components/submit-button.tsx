import React from 'react'
import { Loader2Icon } from 'lucide-react'

import { Button, type ButtonProps } from './ui/button'

interface SubmitButtonProps extends ButtonProps {
  pending?: boolean
  description?: string
  children: React.ReactNode
}

export function SubmitButton({
  pending,
  children,
  description = 'Submit the form',
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      role="link"
      disabled={pending}
      {...props}
      className="w-full"
    >
      {pending ? (
        <>
          <Loader2Icon
            className="mr-2 size-4 animate-spin"
            aria-hidden="true"
          />
          <span>Pending...</span>
        </>
      ) : (
        <>{children}</>
      )}
      <span className="sr-only">{description}</span>
    </Button>
  )
}
