import { Box, Typography } from '@mui/material'
import HelpTooltip from '../atoms/HelpTooltip'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  helpInfo?: string
  rightNode?: ReactNode
}

export default function SectionHeader({ title, helpInfo, rightNode }: SectionHeaderProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography variant="h6">{title}</Typography>
        {rightNode}
      </Box>
      {helpInfo ? <HelpTooltip helpInfo={helpInfo} /> : null}
    </Box>
  )
}
