import { Box, IconButton, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DotDisplay from '../atoms/DotDisplay'

interface Props {
  label: string
  value: number
  min: number
  max: number
  onDecrease: () => void
  onIncrease: () => void
  disableDec?: boolean
  disableInc?: boolean
  labelWidth?: number
}

export default function AttributeDotsControl({
  label,
  value,
  min,
  max,
  onDecrease,
  onIncrease,
  disableDec,
  disableInc,
  labelWidth = 120,
}: Props) {
  const decDisabled = disableDec ?? value <= min
  const incDisabled = disableInc ?? value >= max

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ width: labelWidth }}>{label}</Box>
      <IconButton size="small" aria-label={`decrease ${label}`} onClick={onDecrease} disabled={decDisabled}>
        <RemoveIcon fontSize="small" />
      </IconButton>
      <DotDisplay value={value} />
      <IconButton size="small" aria-label={`increase ${label}`} onClick={onIncrease} disabled={incDisabled}>
        <AddIcon fontSize="small" />
      </IconButton>
    </Stack>
  )
}
