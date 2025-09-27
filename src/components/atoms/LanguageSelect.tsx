import {ToggleButton, ToggleButtonGroup, Tooltip} from '@mui/material'
import {useTranslation} from 'react-i18next'

export default function LanguageSelect() {
  const {i18n, t} = useTranslation()
  const current = (i18n.resolvedLanguage || i18n.language || 'en') as 'en' | 'pt-BR'


  return (
    <Tooltip title={t('language')}>
      <ToggleButtonGroup
        size="small"
        value={current}
        exclusive
        onChange={(_, val) => {
          if (val) i18n.changeLanguage(val)
        }}
        aria-label={t('language')}
        sx={{
          ml: 1,
          '& .MuiToggleButton-root': {
            minWidth: '3em',
          },
        }}
      >
        <ToggleButton value="en" aria-label="English">
          <span
            role="img"
            aria-hidden
            style={{
              display: 'inline-block',
              fontSize: '1.25em',
              transform: 'scale(1.6)',
              transformOrigin: 'center',
              lineHeight: 1
            }}
          >
            🇺🇸
          </span>
        </ToggleButton>
        <ToggleButton value="pt-BR" aria-label="Português (Brasil)">
          <span
            role="img"
            aria-hidden
            style={{
              display: 'inline-block',
              fontSize: '1.25em',
              transform: 'scale(1.6)',
              transformOrigin: 'center',
              lineHeight: 1
            }}
          >
            🇧🇷
          </span>
        </ToggleButton>
      </ToggleButtonGroup>
    </Tooltip>
  )
}
