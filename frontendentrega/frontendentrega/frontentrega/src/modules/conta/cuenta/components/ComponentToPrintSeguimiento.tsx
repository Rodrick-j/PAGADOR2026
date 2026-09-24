import React from "react";
import { SeguimientoHTMLData } from "../CuentaModule";
import '../../../../index.css';

export const ComponentToPrintSeguimiento = React.forwardRef((props: any, ref: any) => {
    const data: SeguimientoHTMLData = props.htmlData;
    if(data) {
        const cite = data.cite;
        const fecha_impresion = data.fecha_impresion;
        const nombre_completo = data.nombre_completo;
        const fecha_saldo = data.fecha_saldo;
        const saldo_numeral = data.saldo_numeral;
        const saldo_literal = data.saldo_literal;
        const concepto = data.concepto;
        return (
            <div ref={ref}>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                </style>
                <div className="text-sm">
                    <div className="flex justify-center items-center bg-white">
                        <div className="w-full container">
                            <div className="flex items-center justify-between">
                                <div className="w-1/4">
                                    <img src="/static/images/bicentenario.jpg" alt="Bicentenario Bolivia" className="h-20" />
                                </div>
                                <div className="w-1/3">
                                    <img src="/static/images/estado.jpg" alt="Estado Plurinacional Bolivia" className="h-22 w-60 mx-auto" />
                                </div>
                                <div className="w-1/3 flex items-center justify-center">
                                    <img src="/static/images/escudo.png" alt="Escudo de Oruro" className="h-20 mr-2" />
                                    <p className="text-1xs font-bold leading-normal">GOBIERNO AUTONOMO DEPARTAMENTAL DE ORURO</p>
                                </div>
                            </div>
                            <div className="flex mt-1">
                                <div className="w-full h-1 border-b-2 border-b-red-600"></div>
                            </div>
                        </div>
                    </div>
                    <main className="flex-grow mx-auto container font-poppins">
                        <div className="bg-white">
                            <div className="mb-3 mt-2">
                                <p className="text-right font-bold underline">CITE: G.A.D.ORU./S.D.A.F.P./U.F/A.C.I./Nº {cite}/2024</p>
                                <p className="text-right">Oruro, {fecha_impresion}</p>
                            </div>
                            <div className="mb-6">
                                <p className="leading-none">Señor:</p>
                                <p className="font-bold leading-none">{nombre_completo}</p>
                                <p className="leading-none underline">Presente.-</p>
                            </div>
                            <div className="mb-4">
                                <p className="font-bold underline">Ref.: CONFIRMACIÓN SALDOS DE CUENTAS A COBRAR</p>
                            </div>
                            <div className="mb-6 text-justify">
                                <p>De nuestra mayor consideración:</p>
                                <p className="my-4">Con motivo de determinar saldos al {fecha_saldo}, correspondiente a cuentas a cobrar, mucho agradecemos se sirva informar a la brevedad posible, directamente a la Secretaría Departamental de Administración y Finanzas Públicas del Gobierno Autónomo Departamental de Oruro, su conformidad o reparo al saldo de sus cuentas por cobrar al {fecha_saldo}. Según nuestros registros, el saldo adeudado por usted refleja <b>Bs. {saldo_numeral} ({saldo_literal} bolivianos)</b> por concepto de {concepto}.</p>
                                <p>Rogamos indicar en el talón de la presente o en carta separada lo siguiente:</p>
                                <ul className="list-disc list-inside ml-4">
                                    <li>En caso de su conformidad, efectuar el depósito a la Cuenta Única de la Gobernación de Oruro Nº 10000006051192 – Banco Unión.</li>
                                    <li>En caso de existir diferencias y/o observaciones, proporcionar la información necesaria para la correspondiente aclaración, directamente al Área de Contabilidad Integrada.</li>
                                </ul>
                                <p className="mt-4">Con este motivo, saludamos a usted atentamente.</p>
                            </div>
                            <div className="border-t border-black mt-4">
                                <h2 className="font-sans text-lg font-bold text-center mt-1">CONFIRMACIÓN SALDO</h2>
                                <p className="font-sans mb-2 text-center font-bold leading-none">(Rogamos devolver este formulario intacto)</p>
                                <p>Atentamente.<br></br></p>
                                <p className="mb-3 leading-none">Señores:<b><br></br>ÁREA DE CONTABILIDAD.</b><br></br><u>Presente</u>. -</p>

                                <p className="mb-3 text-justify">El saldo de <b>Bs. {saldo_numeral} ({saldo_literal} bolivianos)</b> al {fecha_saldo} refleja a favor del Gobierno Autónomo Departamental de Oruro es (correcto) o (incorrecto), con las siguientes excepciones (si las hubiera).</p>
                                <p className="border-b-2 border-b-black border-dotted"></p><br></br>
                                <p className="border-b-2 border-b-black border-dotted"></p><br></br>
                                <p className="border-b-2 border-b-black border-dotted"></p>
                                <p className="mb-2 mt-4">Atentamente.</p>
                                <div className="flex flex-row justify-between">
                                <p className="mb-4 w-80">Fecha: <span className="border-b-2 border-b-black border-dotted w-80">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span></p>
                                <p className="mb-4 text-center"><b>{nombre_completo}</b><br></br>(Nombre y sello)</p>
                                </div>
                            </div>
                        </div>
                    </main>
                    <div className="flex justify-center items-center bg-white">
                        <div className="w-full container">
                            <div className="flex">
                                <div className="w-full h-1 border-t-2 border-t-red-600"></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <p className="text-2xs pl-10" >Plaza 10 de febrero, Presidente Montes entre Bolivar y Adolfo Mier</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xs pr-10" >www.oruro.gob.bo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (<div>No existe informacion</div>)
  });


