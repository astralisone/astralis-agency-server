import { HeroSection } from "@/components/sections/hero"
import { ServicesSection } from "@/components/sections/services"
import { PortfolioSection } from "@/components/sections/portfolio"
import { TestimonialSlider } from "@/components/sections/testimonials/testimonial-slider"
import { CTASection } from "@/components/sections/cta"

export function HomePage() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <TestimonialSlider />
      <CTASection />
    </div>
  )
}