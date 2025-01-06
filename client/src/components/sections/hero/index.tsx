"use client"

import { HeroTitle } from "./hero-title"
import { HeroImage } from "./hero-image"
import { HeroActions } from "./hero-actions"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-background pt-14">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Announcing our next round of products.{' '}
                <a href="/shop" className="font-semibold text-primary">
                  <span className="absolute inset-0" aria-hidden="true" />
                  See all <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <HeroTitle />
            <HeroActions />
          </div>
          <HeroImage />
        </div>
      </div>
    </div>
  )
}