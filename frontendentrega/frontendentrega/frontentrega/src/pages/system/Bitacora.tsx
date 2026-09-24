// src/pages/system/Bitacora.tsx
import { ReactElement } from 'react';
import { Container, Typography } from '@mui/material';
import Page from 'components/Page';
import { BitacoraModule } from 'modules/system/auditoria/bitacora';


export default function Bitacora(): ReactElement {
  return (
    <Page title="Bitácora">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 3 }}>
          Bitácora de actividades
        </Typography>
        <BitacoraModule />
      </Container>
    </Page>
  );
}
