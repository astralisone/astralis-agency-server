"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
})

type FormData = z.infer<typeof formSchema>

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useContactForm() {
  const { toast } = useToast()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const handleSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`${API_URL}/api/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to submit form")
      }

      toast({
        title: "Success!",
        description: "Thank you for your message. We will get back to you soon!",
      })

      form.reset()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while submitting the form",
      })
    }
  }

  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  }
}