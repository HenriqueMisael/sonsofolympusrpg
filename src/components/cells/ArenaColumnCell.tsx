import { Box, Stack, Typography } from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import RemainingHint from '../atoms/RemainingHint'
import AttributeDotsControl from '../molecules/AttributeDotsControl'
import ArenaRankToggle, { type ArenaRank } from '../molecules/ArenaRankToggle'
import { ARENAS, MAX_DOTS, type ArenaName } from '../../store/characterStore'

interface ArenaColumnCellProps {
  arena: ArenaName
  remaining: number
  currentRank: ArenaRank
  onChangeRank: (rank: ArenaRank) => void
  attributes: Record<string, number>
  baseAttr: Record<string, number>
  onDecrease: (attr: string) => void
  onIncrease: (attr: string) => void
  disableIncFor: (attr: string) => boolean
}

export default function ArenaColumnCell({
  arena,
  remaining,
  currentRank,
  onChangeRank,
  attributes,
  baseAttr,
  onDecrease,
  onIncrease,
  disableIncFor,
}: ArenaColumnCellProps) {
  return (
    <Grid2 size={{ xs: 12, md: 4 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        {arena}
        <RemainingHint>{remaining} remaining</RemainingHint>
        <Box sx={{ ml: 'auto', mr: '5em', display: 'flex', alignItems: 'center' }}>
          <ArenaRankToggle
            value={currentRank}
            onChange={onChangeRank}
            ariaLabel={`${arena} priority`}
          />
        </Box>
      </Typography>
      <Stack spacing={1}>
        {ARENAS[arena].map((attr) => (
          <AttributeDotsControl
            key={attr}
            label={attr}
            value={attributes[attr]}
            min={baseAttr[attr]}
            max={MAX_DOTS}
            onDecrease={() => onDecrease(attr)}
            onIncrease={() => onIncrease(attr)}
            disableInc={disableIncFor(attr)}
          />
        ))}
      </Stack>
    </Grid2>
  )
}
