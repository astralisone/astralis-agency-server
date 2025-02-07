"use client"

import { motion } from "framer-motion"
import { Globe, ShoppingBag, Paintbrush, Smartphone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    title: "Web Design",
    description: "Beautiful, responsive websites that engage your audience and drive results.",
    icon: Globe,
  },
  {
    title: "Digital Marketing",
    description: "Strategic marketing solutions to grow your brand and reach new customers.",
    icon: ShoppingBag,
  },
  {
    title: "Brand Identity",
    description: "Distinctive brand designs that make your business stand out from the competition.",
    icon: Paintbrush,
  },
  {
    title: "Mobile Apps",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    icon: Smartphone,
  },
]

export function ServicesSection() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Services</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We offer a comprehensive range of digital services to help your business thrive.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{service.title}</CardTitle>
                <p className="text-muted-foreground">{service.description}</p>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}