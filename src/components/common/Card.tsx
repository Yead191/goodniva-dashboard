import { ReactNode, CSSProperties } from 'react'

interface CardProps {
  children: ReactNode
  style?: CSSProperties
  padding?: number
}

const Card = ({ children, style, padding = 20 }: CardProps) => (
  <div
    className="bg-surface rounded-2xl border border-line-light"
    style={{ padding, ...style }}
  >
    {children}
  </div>
)

export default Card
