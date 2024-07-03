# Upload file with Next.js and Server Actions

This example shows how you can build upload forms with Next.js and Server Actions, which focus on advanced server-side validation. 

# Pros and cons

- `onSumit` is most recommend way, we can easily use `zod` to validate the form both on the client and the server without third-party react form library. 

- `useFormState` is most progressive enhancement way, we can validate the form event when JavaScript is disable on our browsers, but there is no client-size form validation any more.

-  `useForm` is most UX way, we can easily develop the form page with `react-hook-form`, but there is no server-side form validation any more. On the other hand, it will spend you extra time to refactor the form, sometimes it's not a better choice for simple pages. 

## Caveats

- The submitted file form data as Server Action handler argument should always be a `Formdate` instance, otherwise you'll meet the below error:

```bash
Error: Only plain objects, and a few built-ins, can be passed to Server Actions. Classes or null prototypes are not supported.
```

 When invoked in a form, the action automatically receives the formData object. If you have validated the upload form with `use react-hook-form` on the client-side, the formData object will be unwrapped automatically, we can wrap it again manually to find a problem solution. e.g.:

 ```javascript
const formData = new FormData()
formData.append('name', values.name)
formData.append('picture', values.picture)
 ``` 

 Or simply use the second event param of `SubmitHandler` if there are many form fields: 

 ```javascript
const onSubmit: SubmitHandler<UploadValue> = async (
  _values, event
) => {
  const formData = new FormData(event.currentTarget)
}
 ```

- If you got the following error when using `z.instanceof(File)` :

```bash
Error: File is not defined
```
Check you node version, the iisue has been fixed from 20x. 

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/server-actions-upload&project-name=server-actions-upload&repository-name=server-actions-upload)


Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).
