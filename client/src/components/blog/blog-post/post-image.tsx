interface PostImageProps {
  src: string
  alt: string
}

export function PostImage({ src, alt }: PostImageProps) {
  return (
    <div className="aspect-[2/1] overflow-hidden rounded-lg mb-8">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  )
}