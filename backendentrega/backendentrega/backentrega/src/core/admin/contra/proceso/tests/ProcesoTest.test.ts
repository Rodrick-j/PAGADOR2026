import ProcesoService from '..';

test('CRUD Proceso', async () => {

const creaProcesoParams = {    
    objetoContratacion: "PRUEBA",
    modalidadDescripcion: "LP - Licitacion Publica > 1.000.000 - 70.000.000",
    modalidadSigla: "LP",
    codigoInternoEntidad: "GAD ORU/ANPE-CIL-12/2023",
    cuce: "01-1234-02-1234567-1-1",
    fechaRegistro: new Date("2024-05-20T00:05:59.307Z"),
    gestion: "2024",
    hojaRuta: "GAD ORU/ANPE-CIL-12/2023",
    estado: "PENDIENTE",
    usuarioId            : "00000000-0000-0000-0000-000000000001",
    usuarioSolicitanteId: "4d0c0b4b-6a93-4ce3-a071-c06b70083be7",
    usuarioSolicitante2Id: "4d0c0b4b-6a93-4ce3-a071-c06b70083be7",
    usuarioSolicitante3Id: "4d0c0b4b-6a93-4ce3-a071-c06b70083be7",
    estadoActivo:'ABIERTO',
    areaId: "8ad36d54-59f0-4877-bb9b-90b4bb320651"
}

  //Create
  const ProcesoCreateResult = await ProcesoService.creaProceso(creaProcesoParams);
  expect(ProcesoCreateResult.isSuccess).toEqual(true);
  const Proceso = ProcesoCreateResult.getValue()

  //GetAll
  const ProcesoGetAllResult = await ProcesoService.getAll();
  expect(ProcesoGetAllResult.isSuccess).toEqual(true);
  expect(ProcesoGetAllResult.getValue().length).toBeGreaterThan(0)

  //Get
  const ProcesoGetResult = await ProcesoService.getById(Proceso.id);
  expect(ProcesoGetResult.isSuccess).toEqual(true);

  //Update

  const editaProcesoParams = { 
    ...creaProcesoParams,
    id: Proceso.id
  }
  
  const ProcesoUpdateResult = await ProcesoService.editaProceso(editaProcesoParams)
  expect(ProcesoUpdateResult.isSuccess).toEqual(true);
  const ProcesoGetAfterUpdateResult = await ProcesoService.getById(Proceso.id)
  expect(ProcesoGetAfterUpdateResult.isSuccess).toEqual(true);
  expect(ProcesoGetAfterUpdateResult.getValue().props).toEqual({
    ...Proceso.props,
    email: 'bob2@domain.com',
    celular: '1234567' 
  })

  //Delete
  const ProcesoDeleteResult = await ProcesoService.delete(Proceso.id);
  expect(ProcesoDeleteResult.isSuccess).toEqual(true);
  const ProcesoGetAfterDeleteResult = await ProcesoService.getById(Proceso.id)
  expect(ProcesoGetAfterDeleteResult.isSuccess).toEqual(false);

});
