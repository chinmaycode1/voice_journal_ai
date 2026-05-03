interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
}

export function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  className = ''
}: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius
      }}
    />
  )
}
