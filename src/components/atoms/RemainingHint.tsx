import { Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface RemainingHintProps {
  children: ReactNode
}

export default function RemainingHint({ children }: RemainingHintProps) {
  return (
    <Typography component="span" variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
      {children}
    </Typography>
  )
}
