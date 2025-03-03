import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react'
import type { EmblaOptionsType } from 'embla-carousel'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type CarouselProps = {
  options?: EmblaOptionsType
  className?: string
  children: React.ReactNode
  showControls?: boolean
  showDots?: boolean
}

type DotButtonProps = {
  selected: boolean
  onClick: () => void
}

export function Carousel({
  options,
  className,
  children,
  showControls = true,
  showDots = true,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    ...options,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback((emblaApi: UseEmblaCarouselType[0]) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    onSelect(emblaApi)

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const DotButton = ({ selected, onClick }: DotButtonProps) => (
    <button
      className={cn(
        'w-2 h-2 rounded-full mx-1 transition-all',
        selected ? 'bg-primary' : 'bg-muted-foreground/30'
      )}
      type="button"
      onClick={onClick}
    />
  )

  return (
    <div className={cn('relative', className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">{children}</div>
      </div>
      
      {showControls && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
      
      {showDots && scrollSnaps.length > 0 && (
        <div className="flex justify-center mt-4">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const CarouselItem = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div className={cn('min-w-0 flex-full', className)}>
      {children}
    </div>
  )
} 