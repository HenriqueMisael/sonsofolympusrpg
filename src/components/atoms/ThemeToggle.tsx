import {IconButton, Tooltip} from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import {useTheme} from '@mui/material/styles'
import {useThemeStore} from '../../store/themeStore'
import {useTranslation} from 'react-i18next'

export default function ThemeToggle() {
  const theme = useTheme()
  const toggle = useThemeStore((s) => s.toggle)
  const {t} = useTranslation()

  const isDark = theme.palette.mode === 'dark'

  return (
    <Tooltip title={isDark ? t('lightMode') : t('darkMode')}>
      <IconButton color="inherit" onClick={toggle} aria-label={isDark ? t('lightMode') : t('darkMode')}>
        {isDark ? <Brightness7Icon/> : <Brightness4Icon/>}
      </IconButton>
    </Tooltip>
  )
}
