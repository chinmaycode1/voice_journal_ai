interface AvatarProps {
  src?: string | null
  alt?: string
  fallback?: string
  size?: number
  className?: string
}

export function Avatar({ src, alt = 'Avatar', fallback = 'U', size = 40, className = '' }: AvatarProps) {
  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-accent to-accent2 text-white font-bold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <span>{fallback.charAt(0).toUpperCase()}</span>
      )}
    </div>
  )
}
