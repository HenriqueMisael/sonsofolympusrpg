import { ToggleButton, ToggleButtonGroup } from '@mui/material'

export type ArenaRank = 'Primary' | 'Secondary' | 'Tertiary'

interface ArenaRankToggleProps {
  value: ArenaRank
  onChange: (rank: ArenaRank) => void
  ariaLabel?: string
}

export default function ArenaRankToggle({ value, onChange, ariaLabel }: ArenaRankToggleProps) {
  return (
    <ToggleButtonGroup
      size="small"
      value={value}
      exclusive
      onChange={(_, val: ArenaRank | null) => {
        if (!val) return
        onChange(val)
      }}
      aria-label={ariaLabel}
      sx={{
        alignSelf: 'center',
        '& .MuiToggleButton-root': {
          minWidth: '1.25em',
          px: 0.25,
          py: 0,
          lineHeight: 1,
          minHeight: 'auto',
        },
        '& .MuiToggleButton-root.Mui-selected': {
          minWidth: '6em',
          px: 1,
          py: 0,
        },
      }}
    >
      {(['Primary', 'Secondary', 'Tertiary'] as ArenaRank[]).map((rank) => (
        <ToggleButton key={rank} value={rank} aria-label={`Set as ${rank}`}>
          {value === rank ? rank : ''}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
