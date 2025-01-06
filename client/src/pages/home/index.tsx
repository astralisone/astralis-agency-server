import { HeroSection } from "@/components/sections/hero"
import { ServicesSection } from "@/components/sections/services"
import { PortfolioSection } from "@/components/sections/portfolio"
import { TestimonialsSection } from "@/components/sections/testimonials"
import { CTASection } from "@/components/sections/cta"

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}