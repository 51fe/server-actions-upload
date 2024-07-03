import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { SubmitForm } from './on-submit'
import { ActionForm } from './use-form-state'
import { HookForm } from './use-form'

export default function Home() {
  return (
    <Tabs defaultValue="2">
      <TabsList>
        <TabsTrigger value="1">onSubmit</TabsTrigger>
        <TabsTrigger value="2">useFormState</TabsTrigger>
        <TabsTrigger value="3">useForm</TabsTrigger>
      </TabsList>
      <section className="mt-8">
        <TabsContent value="1">
          <SubmitForm />
        </TabsContent>
        <TabsContent value="2">
          <ActionForm />
        </TabsContent>
        <TabsContent value="3">
          <HookForm />
        </TabsContent>
      </section>
    </Tabs>
  )
}
