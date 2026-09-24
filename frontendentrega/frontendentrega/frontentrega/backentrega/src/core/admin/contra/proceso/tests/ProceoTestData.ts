import { ProcesoEntity } from '../ProcesoEntity';
import ProcesoService from '..';

export default async function createTestProceso(): Promise<ProcesoEntity> {
  const createProps = {
    objetoContratacion   : 'CONST. COMPLEJO PATRIMONIAL CULTURAL ORURO (PAQUETE I) - DIRECCION DE INFRAESTRUCTURA',
    modalidadDescripcion : 'LP - Licitacion Publica > 1.000.000 - 70.000.000',
    modalidadSigla       : 'LP',
    codigoInternoEntidad : 'GADOR-LP-O-N°01/2024',
    cuce                 : '24-0904-00-1421249-1-1',
    fechaRegistro        : new Date('2024-03-20 10:06:53'),
    gestion              : '2024',
    hojaRuta             : 'SDAFP-1905/2024',
    estado               : 'PENDIENTE',
    usuarioId            : '00000000-0000-0000-0000-000000000001',
    usuarioSolicitanteId : '9b6d6376-ab01-410e-8f42-a07b291efc3a',
    usuarioSolicitante2Id: '553e545c-b819-4024-a91d-301ecd7e2043',
    usuarioSolicitante3Id : '9b6d6376-ab01-410e-8f42-a07b291efc3a',
    estadoActivo :'ABIERTO',
    areaId               : 'd1eada7b-2a4f-4812-b41a-65378208e378'
  }

  const procesoCreateResult = await ProcesoService.creaProceso(createProps);

  return procesoCreateResult.getValue();
}
