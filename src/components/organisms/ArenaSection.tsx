import {Box, Divider} from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import ArenaColumnCell from '../cells/ArenaColumnCell'
import {type ArenaName} from '../../store/characterStore'
import type {ArenaRank} from '../molecules/ArenaRankToggle'
import SectionHeader from "../molecules/SectionHeader.tsx";

interface ArenaSectionProps {
  arenas: ArenaName[]
  attributes: Record<string, number>
  baseAttr: Record<string, number>
  arenaRemaining: Record<ArenaName, number>
  primaryArena: ArenaName
  secondaryArena: ArenaName
  setPrimaryArena: (a: ArenaName) => void
  setSecondaryArena: (a: ArenaName) => void
  setTertiaryArena: (a: ArenaName) => void
  setAttribute: (attr: string, value: number) => void
}

export default function ArenaSection({
                                       arenas,
                                       attributes,
                                       baseAttr,
                                       arenaRemaining,
                                       primaryArena,
                                       secondaryArena,
                                       setPrimaryArena,
                                       setSecondaryArena,
                                       setTertiaryArena,
                                       setAttribute,
                                     }: ArenaSectionProps) {
  const getRankFor = (arena: ArenaName): ArenaRank =>
    arena === primaryArena ? 'Primary' : arena === secondaryArena ? 'Secondary' : 'Tertiary'

  const handleRankChange = (arena: ArenaName, rank: ArenaRank) => {
    if (rank === 'Primary') setPrimaryArena(arena)
    else if (rank === 'Secondary') setSecondaryArena(arena)
    else setTertiaryArena(arena)
  }

  return (
    <Box>
      <SectionHeader
        title="Attributes"
        helpInfo="All start at 1. Choose arenas: Primary (6), Secondary (4), Tertiary (2), Max 5. Use the – / + buttons to assign within each arena’s pool."
      />
      <Divider sx={{my: 1}}/>
      <Grid2 container spacing={2} sx={{mt: 1}}>
        {arenas.map((arena) => (
          <ArenaColumnCell
            key={arena}
            arena={arena}
            remaining={arenaRemaining[arena]}
            currentRank={getRankFor(arena)}
            onChangeRank={(rank) => handleRankChange(arena, rank)}
            attributes={attributes}
            baseAttr={baseAttr}
            onDecrease={(attr) => setAttribute(attr, attributes[attr] - 1)}
            onIncrease={(attr) => setAttribute(attr, attributes[attr] + 1)}
            disableIncFor={(attr) => attributes[attr] >= 5 || arenaRemaining[arena] <= 0}
          />
        ))}
      </Grid2>
    </Box>
  )
}
