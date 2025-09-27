import {Box, Container} from '@mui/material'
import {Outlet} from 'react-router-dom'
import Header from '../molecules/Header'

export default function Layout() {
  return (
    <Box sx={{display: 'flex', justifyContent: 'center', width: '100vw'}}>
      <Box sx={{minHeight: '100dvh', minWidth: '75em', display: 'flex', flexDirection: 'column'}}>
        <Header/>
        <Container component="main" maxWidth="lg" sx={{py: 3, flex: 1, width: '100%'}}>
          <Outlet/>
        </Container>
      </Box>
    </Box>
  )
}
