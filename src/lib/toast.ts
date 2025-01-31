import { toast } from "svelte-french-toast";

export const promise = (p: Promise<unknown>, e?: {
  progress?: string,
  success?: string,
  error?: string
}) => {
  return toast.promise(p, {
    loading: e?.progress ?? "Loading...",
    success: e?.success ?? "Done!",
    error: e?.error ?? ((e) => {
      return e + "";
    })
  }, {
    style: "background: rgb(39,39,42); color: #e5e7eb;"
  })
}