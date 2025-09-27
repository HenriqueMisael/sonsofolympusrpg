import {useState} from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import {type ArenaName, ARENAS, SKILLS, useCharacterStore,} from '../store/characterStore'
import SkillDotsControl from '../components/molecules/SkillDotsControl'
import SectionHeader from '../components/molecules/SectionHeader'
import PathsSection from '../components/organisms/PathsSection'
import RemainingHint from '../components/atoms/RemainingHint'
import ArenaSection from '../components/organisms/ArenaSection'


export default function Character() {
  // Store selectors/actions
  const name = useCharacterStore((s) => s.name)
  const pantheon = useCharacterStore((s) => s.pantheon)
  const concept = useCharacterStore((s) => s.concept)
  const setName = (v: string) => useCharacterStore.setState({name: v})
  const setPantheon = (v: string) => useCharacterStore.setState({pantheon: v})
  const setConcept = (v: string) => useCharacterStore.setState({concept: v})

  const paths = useCharacterStore((s) => s.paths)
  const setPathName = useCharacterStore((s) => s.setPathName)
  const setPathSkills = useCharacterStore((s) => s.setPathSkills)
  const primaryPath = useCharacterStore((s) => s.primaryPath)
  const secondaryPath = useCharacterStore((s) => s.secondaryPath)
  const tertiaryPath = useCharacterStore((s) => s.tertiaryPath)
  const setPrimaryPath = useCharacterStore((s) => s.setPrimaryPath)
  const setSecondaryPath = useCharacterStore((s) => s.setSecondaryPath)
  const setTertiaryPath = useCharacterStore((s) => s.setTertiaryPath)

  const primaryArena = useCharacterStore((s) => s.primaryArena)
  const secondaryArena = useCharacterStore((s) => s.secondaryArena)
  const tertiaryArena = useCharacterStore((s) => s.tertiaryArena)
  const setPrimaryArena = useCharacterStore((s) => s.setPrimaryArena)
  const setSecondaryArena = useCharacterStore((s) => s.setSecondaryArena)
  const setTertiaryArena = useCharacterStore((s) => s.setTertiaryArena)

  // Subscribe to stable derived function refs + raw slices to trigger re-render
  const attributesFn = useCharacterStore((s) => s.attributes)
  const baseAttrFn = useCharacterStore((s) => s.baseAttr)
  const setAttribute = useCharacterStore((s) => s.setAttribute)
  const _attrManual = useCharacterStore((s) => s.attrManual)
  void _attrManual
  const attributes = attributesFn()
  const baseAttr = baseAttrFn()

  const arenaRemainingFn = useCharacterStore((s) => s.arenaRemaining)
  const _arenaDeps = {primaryArena, secondaryArena, tertiaryArena}
  void _arenaDeps
  const arenaRemaining = arenaRemainingFn()

  const finalSkillsFn = useCharacterStore((s) => s.finalSkills)
  const remainingBonusFn = useCharacterStore((s) => s.remainingBonus)
  const _paths = useCharacterStore((s) => s.paths)
  const _skillManualAdjust = useCharacterStore((s) => s.skillManualAdjust)
  void _paths
  void _skillManualAdjust
  const finalSkills = finalSkillsFn()
  const remainingBonus = remainingBonusFn()
  const incSkill = useCharacterStore((s) => s.incSkill)
  const decSkill = useCharacterStore((s) => s.decSkill)
  const specialties = useCharacterStore((s) => s.specialties)
  const setSpecialty = useCharacterStore((s) => s.setSpecialty)

  const calling = useCharacterStore((s) => s.calling)
  const setCalling = useCharacterStore((s) => s.setCalling)
  const knacks = useCharacterStore((s) => s.knacks)
  const addKnack = useCharacterStore((s) => s.addKnack)
  const removeKnack = useCharacterStore((s) => s.removeKnack)
  const setKnack = useCharacterStore((s) => s.setKnack)

  const legend = useCharacterStore((s) => s.legend)
  const setLegend = useCharacterStore((s) => s.setLegend)
  const birthrights = useCharacterStore((s) => s.birthrights)
  const setBirthrights = useCharacterStore((s) => s.setBirthrights)
  const notes = useCharacterStore((s) => s.notes)
  const setNotes = useCharacterStore((s) => s.setNotes)

  const exportDataFn = useCharacterStore((s) => s.exportData)
  const exportData = exportDataFn()

  // UI-local state
  const [openExport, setOpenExport] = useState(false)

  // --- Render helpers removed: arena selector extracted as a component ---

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Character Builder</Typography>

      <Grid2 container spacing={2}>
        <Grid2 size={{xs: 12, md: 5}}>
          <Box>
            <Typography variant="h6">Character Info</Typography>
            <Divider sx={{my: 1}}/>
            <Grid2 container spacing={2}>
              <Grid2 size={{xs: 12, md: 6}}>
                <TextField fullWidth label="Character Name" value={name} onChange={(e) => setName(e.target.value)}/>
              </Grid2>
              <Grid2 size={{xs: 12, md: 6}}>
                <TextField
                  fullWidth
                  label="Pantheon / Divine Parent"
                  value={pantheon}
                  onChange={(e) => setPantheon(e.target.value)}
                />
              </Grid2>
              <Grid2 size={{xs: 12}}>
                <TextField
                  variant="standard"
                  maxRows={11}
                  fullWidth
                  multiline
                  label="Concept"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                />
              </Grid2>
            </Grid2>
          </Box>
        </Grid2>
        <Grid2 size={{xs: 12, md: 7}}>
          <Box>
            <SectionHeader
              title="Paths"
              helpInfo="Drag the Path cards to set priority: top = Primary (3 dots each), middle = Secondary (2), bottom = Tertiary (1). Dots from multiple Paths stack up to 5; any overflow is redistributed among your selected Path skills."
            />
            <PathsSection
              paths={paths}
              primaryPath={primaryPath}
              secondaryPath={secondaryPath}
              tertiaryPath={tertiaryPath}
              setPrimaryPath={setPrimaryPath}
              setSecondaryPath={setSecondaryPath}
              setTertiaryPath={setTertiaryPath}
              setPathName={setPathName}
              setPathSkills={setPathSkills}
            />
          </Box>
        </Grid2>
      </Grid2>

      <ArenaSection
        arenas={(Object.keys(ARENAS) as ArenaName[])}
        attributes={attributes}
        baseAttr={baseAttr}
        arenaRemaining={arenaRemaining}
        primaryArena={primaryArena}
        secondaryArena={secondaryArena}
        setPrimaryArena={setPrimaryArena}
        setSecondaryArena={setSecondaryArena}
        setTertiaryArena={setTertiaryArena}
        setAttribute={setAttribute}
      />

      {/* Skills */}
      <Box>
        <SectionHeader
          title="Skills"
          helpInfo="Auto-filled from Paths. You can assign 5 bonus dots. When a skill reaches 3+, add a specialty."
          rightNode={<RemainingHint>{remainingBonus} remaining</RemainingHint>}
        />
        <Divider sx={{my: 1}}/>
        <Grid2 container spacing={1}>
          {SKILLS.map((s) => {
            const val = finalSkills[s] ?? 0
            return (
              <Grid2 key={s} size={{xs: 12, md: 6}}>
                <SkillDotsControl
                  name={s}
                  value={val}
                  onDecrease={() => decSkill(s)}
                  onIncrease={() => incSkill(s)}
                  dim={val === 0}
                  specialty={specialties[s] ?? ''}
                  onSpecialtyChange={(v) => setSpecialty(s, v)}
                />
              </Grid2>
            )
          })}
        </Grid2>
      </Box>

      {/* Calling & Knacks */}
      <Box>
        <Typography variant="h6">Calling and Knacks</Typography>
        <Divider sx={{my: 1}}/>
        <Grid2 container spacing={2}>
          <Grid2 size={{xs: 12, md: 4}}>
            <TextField fullWidth label="Calling" value={calling} onChange={(e) => setCalling(e.target.value)}/>
          </Grid2>
          <Grid2 size={{xs: 12, md: 8}}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Knacks</Typography>
              {knacks.map((k, i) => (
                <Stack key={i} direction="row" spacing={1}>
                  <TextField fullWidth label={`Knack ${i + 1}`} value={k}
                             onChange={(e) => setKnack(i, e.target.value)}/>
                  <Button color="error" onClick={() => removeKnack(i)}>Remove</Button>
                </Stack>
              ))}
              <Button onClick={() => addKnack()}>Add Knack</Button>
            </Stack>
          </Grid2>
        </Grid2>
      </Box>

      {/* Other Info */}
      <Box>
        <Typography variant="h6">Other Information</Typography>
        <Divider sx={{my: 1}}/>
        <Grid2 container spacing={2}>
          <Grid2 size={{xs: 12, md: 2}}>
            <TextField type="number" slotProps={{htmlInput: {min: 1}}} fullWidth label="Legend" value={legend}
                       onChange={(e) => setLegend(Math.max(1, Number(e.target.value) || 1))}/>
          </Grid2>
          <Grid2 size={{xs: 12, md: 5}}>
            <TextField fullWidth label="Birthrights / Relics" value={birthrights}
                       onChange={(e) => setBirthrights(e.target.value)}/>
          </Grid2>
          <Grid2 size={{xs: 12, md: 5}}>
            <TextField fullWidth label="Notes" multiline minRows={2} value={notes}
                       onChange={(e) => setNotes(e.target.value)}/>
          </Grid2>
        </Grid2>
      </Box>

      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={() => setOpenExport(true)}>Export JSON</Button>
      </Stack>

      <Dialog open={openExport} onClose={() => setOpenExport(false)} maxWidth="md" fullWidth>
        <DialogTitle>Exported Character JSON</DialogTitle>
        <DialogContent>
          <TextField fullWidth multiline minRows={11} value={JSON.stringify(exportData, null, 2)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExport(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
