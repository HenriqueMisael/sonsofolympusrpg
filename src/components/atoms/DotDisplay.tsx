import { Box } from '@mui/material'
import { MAX_DOTS } from '../../store/characterStore'

export default function DotDisplay({ value }: { value: number }) {
  return (
    <Box sx={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
      {Array.from({ length: MAX_DOTS }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          style={{ fontSize: 18, color: '#fff', opacity: i < value ? 1 : 0.35 }}
        >
          ●
        </span>
      ))}
    </Box>
  )
}
