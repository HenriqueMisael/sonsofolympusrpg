import { IconButton, Tooltip } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'

export default function HelpTooltip({ helpInfo }: { helpInfo: string }) {
  return (
    <Tooltip title={helpInfo} placement="right">
      <IconButton size="small">
        <HelpIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  )
}
