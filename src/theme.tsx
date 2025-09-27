import {CssBaseline, ThemeProvider} from '@mui/material'
import {createTheme, responsiveFontSizes} from '@mui/material/styles'
import {type PropsWithChildren, useMemo} from 'react'
import {useThemeStore} from './store/themeStore'

export function AppThemeProvider({children}: PropsWithChildren) {
  const mode = useThemeStore((s) => s.mode)

  const theme = useMemo(() => {
    const base = createTheme({
      palette: {mode},
      shape: {borderRadius: 8},
      typography: {
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
        button: {textTransform: 'none', fontWeight: 600}
      },
      components: {
        MuiAppBar: {
          defaultProps: {color: 'default', elevation: 0}
        },
        MuiButton: {
          defaultProps: {disableElevation: true}
        },
        MuiContainer: {
          defaultProps: {maxWidth: 'lg'}
        }
      }
    })
    return responsiveFontSizes(base)
  }, [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      {children}
    </ThemeProvider>
  )
}
