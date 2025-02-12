"use client"

import { motion } from "framer-motion"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { FormFields } from "./form-fields"
import { useContactForm } from "./use-contact-form"

export function ContactForm() {
  const { form, handleSubmit, isSubmitting } = useContactForm()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="rounded-lg border bg-card p-8">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormFields form={form} />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Form>
      </div>
    </motion.div>
  )
}