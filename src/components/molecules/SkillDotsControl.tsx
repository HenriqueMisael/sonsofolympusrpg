import { Box, IconButton, Stack, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DotDisplay from '../atoms/DotDisplay'

interface Props {
  name: string
  value: number
  onIncrease: () => void
  onDecrease: () => void
  dim?: boolean
  specialty?: string
  onSpecialtyChange?: (v: string) => void
}

export default function SkillDotsControl({
  name,
  value,
  onIncrease,
  onDecrease,
  dim,
  specialty,
  onSpecialtyChange,
}: Props) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ width: 160, color: dim ? 'text.disabled' : 'text.primary' }}>{name}</Box>
        <IconButton size="small" aria-label={`decrease ${name}`} onClick={onDecrease}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <DotDisplay value={value} />
        <IconButton size="small" aria-label={`increase ${name}`} onClick={onIncrease}>
          <AddIcon fontSize="small" />
        </IconButton>
        {value >= 3 && (
          <TextField
            variant="standard"
            size="small"
            placeholder="Specialty"
            value={specialty ?? ''}
            onChange={(e) => onSpecialtyChange?.(e.target.value)}
            sx={{ ml: 1, flex: 1, maxWidth: 200 }}
          />
        )}
      </Stack>
    </Stack>
  )
}
