import { Divider, Stack } from '@mui/material'
import PathCard from '../molecules/PathCard'
import type { Path, PathKey } from '../../store/characterStore'

interface PathsSectionProps {
  paths: Record<PathKey, Path>
  primaryPath: PathKey
  secondaryPath: PathKey
  tertiaryPath: PathKey
  setPrimaryPath: (p: PathKey) => void
  setSecondaryPath: (p: PathKey) => void
  setTertiaryPath: (p: PathKey) => void
  setPathName: (key: PathKey, name: string) => void
  setPathSkills: (key: PathKey, skills: string[]) => void
}

export default function PathsSection({
  paths,
  primaryPath,
  secondaryPath,
  tertiaryPath,
  setPrimaryPath,
  setSecondaryPath,
  setTertiaryPath,
  setPathName,
  setPathSkills,
}: PathsSectionProps) {
  const order: PathKey[] = [primaryPath, secondaryPath, tertiaryPath]

  return (
    <>
      <Divider sx={{ my: 1 }} />
      <Stack spacing={2} sx={{ mb: 2 }}>
        {order.map((pkey, index) => (
          <PathCard
            key={pkey}
            index={index}
            pkey={pkey}
            name={paths[pkey].name}
            skills={paths[pkey].skills}
            onTypeChange={(val) => {
              if (index === 0) setPrimaryPath(val)
              else if (index === 1) setSecondaryPath(val)
              else setTertiaryPath(val)
            }}
            onNameChange={(val) => setPathName(pkey, val)}
            onSkillsChange={(vals) => setPathSkills(pkey, vals)}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', String(index))
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const from = Number(e.dataTransfer.getData('text/plain'))
              const to = index
              if (Number.isNaN(from) || from === to) return
              const newOrder = order.slice()
              const [moved] = newOrder.splice(from, 1)
              newOrder.splice(to, 0, moved)
              setPrimaryPath(newOrder[0])
              setSecondaryPath(newOrder[1])
            }}
          />
        ))}
      </Stack>
    </>
  )
}
