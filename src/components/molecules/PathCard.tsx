import { Box, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { SKILLS } from '../../store/characterStore'
import type { PathKey } from '../../store/characterStore'

interface PathCardProps {
  index: number
  pkey: PathKey
  name: string
  skills: string[]
  onTypeChange: (p: PathKey) => void
  onNameChange: (val: string) => void
  onSkillsChange: (skills: string[]) => void
  // drag & drop
  draggable?: boolean
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
}

export default function PathCard({
  index,
  pkey,
  name,
  skills,
  onTypeChange,
  onNameChange,
  onSkillsChange,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
}: PathCardProps) {
  return (
    <Box
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      sx={{
        p: 2,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: 1,
        cursor: draggable ? 'grab' : 'default',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1, gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Tertiary'}
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Stack direction="row" spacing={2} sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
          <FormControl sx={{ width: '6em', alignSelf: 'end' }}>
            <Select
              variant="standard"
              labelId={`type-${index}`}
              label="Type"
              value={pkey}
              onChange={(e) => onTypeChange(e.target.value as PathKey)}
            >
              {(['Origin', 'Role', 'Pantheon'] as PathKey[]).map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            variant="standard"
            label={`Name`}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            fullWidth
            sx={{ width: '12em' }}
          />
          <FormControl sx={{ flex: 1 }}>
            <InputLabel id={`${pkey}-skills`}>Select up to 3 skills</InputLabel>
            <Select
              variant="standard"
              labelId={`${pkey}-skills`}
              label="Select up to 3 skills"
              multiple
              value={skills}
              onChange={(e) =>
                onSkillsChange(
                  typeof e.target.value === 'string'
                    ? (e.target.value as string).split(',')
                    : (e.target.value as string[])
                )
              }
              renderValue={(selected) => (selected as string[]).join(', ')}
            >
              {SKILLS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>
    </Box>
  )
}
