import {Box, Typography} from '@mui/material'
import {useTranslation} from 'react-i18next'

export default function About() {
  const {t} = useTranslation()
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('about')}
      </Typography>
      <Typography>{t('aboutText')}</Typography>
    </Box>
  )
}
