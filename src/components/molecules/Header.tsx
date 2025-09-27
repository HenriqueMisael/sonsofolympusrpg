import {AppBar, Box, Button, Toolbar, Typography} from '@mui/material'
import {Link as RouterLink, useLocation} from 'react-router-dom'
import ThemeToggle from '../atoms/ThemeToggle'
import LanguageSelect from '../atoms/LanguageSelect'
import {useTranslation} from 'react-i18next'

export default function Header() {
  const {t} = useTranslation()
  const {pathname} = useLocation()

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{borderBottom: 1, borderColor: 'divider', px: '1em'}}>
      <Toolbar disableGutters>
        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
          {t('appName')}
        </Typography>
        <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            variant={pathname === '/' ? 'outlined' : 'text'}
          >
            {t('home')}
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/about"
            variant={pathname === '/about' ? 'outlined' : 'text'}
          >
            {t('about')}
          </Button>
          <LanguageSelect/>
          <ThemeToggle/>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
