import request from "request";
import fs from "fs";
import moment from "moment";
//import axios from 'axios';

//import { URL_FERIADOS } from "../config/app-config";

/**
 * Crea un paginador a partir de un array
 * @param rows Lista de objetos
 * @param query parámetros enviados desde la url
 *
 * @example
 *
 *    /api/users?_limit=10&_page=1&q=some_search_value&_sort=nombre&_order=desc
 *
 *    return { rows, count }
 */
export const findAndCountResult = <T>(
    rows: T[],
    query?: any,
): { rows: T[]; count: number; limit: number; page: number } => {

    const limit = Number(query?._limit || "50000");
    const page = Number(query?._page || "1");
    const q = query?.q;

    const { _sort, _order } = query || {};
    const sort = _sort;
    const order = _order || "desc";

    const compareFunction = (a: any, b: any) => {
        const aValue = a[sort];
        const bValue = b[sort];

        if (aValue === undefined || bValue === undefined) return 0;

        return (aValue > bValue) ? (order === "asc" ? 1 : -1)
             : (aValue < bValue) ? (order === "asc" ? -1 : 1)
             : 0;
    };

    let rowsFiltered = [...rows];

    if (sort) {
        rowsFiltered = rowsFiltered.sort(compareFunction);
    }

    // Búsqueda global con `q`
    if (q) {
        const qLower = q.toLowerCase();
        rowsFiltered = rowsFiltered.filter((row: any) => {
            return Object.keys(row).some((key) => {
                const value = (row as Record<string, any>)[key];
                return typeof value === "string" && value.toLowerCase().includes(qLower);
            });
        });
    }

    // Filtros específicos por campo
    const filters = query && Object.keys(query).filter((key) =>
        !["_limit", "_page", "q", "_order", "_sort"].includes(key)
    ) || [];

    if (filters.length > 0) {
        rowsFiltered = rowsFiltered.filter((row: any) => {
            return filters.every((key: string) => {
                const value = (row as Record<string, any>)[key];
                const queryValue = query[key];

                if (queryValue === undefined || typeof value === "undefined") return false;

                if (typeof value === "number") {
                    return value == queryValue;
                }

                if (isValidDate(queryValue)) {
                    const formattedDateString = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
                    const formattedDate = moment.utc(formattedDateString).toDate();
                    const queryDate = new Date(queryValue);
                    return compararFechas(queryDate, formattedDate) === 0;
                }

                if (typeof value === "string") {
                    return value.toLowerCase().includes(queryValue.toLowerCase());
                }

                return false;
            });
        });
    }

    const total = rowsFiltered.length;
    const start = (page - 1) * limit;
    const end = start + limit;

    const rowsPaginated = rowsFiltered.slice(start, end);

    return {
        rows: rowsPaginated,
        count: total,
        limit,
        page
    };
};

/**
 * Cambia de un texto a oracion
 * @param {String} value - Cadena de texto.
 * @return {String}
 * @example
 *
 *    66.66666666666667  =>  66.67
 *    58.33333333333336  =>  58.33
 */
export const toWordUpperFirstCase = (value: string): string => {
    return value[0].toUpperCase() + value.slice(1);
};

/**
 * @param value is the value to round
 * @param places if positive the number of decimal places to round to, if negative the number of digits to round to
 *
 * @example
 *
 *    66.66666666666667  =>  66.67
 *    58.33333333333336  =>  58.33
 */
export const roundTo = (value: number, places = 2): number => {
    const power = Math.pow(10, places);
    return Math.round(value * power) / power;
};

/**
 * Interpreta una cadena de texto y devuelve su valor numérico con un máximo de 2 dígitos.
 * Es útil para obtener números válidos desde un campo de entrada de texto.
 * @param {String} value - Cadena de texto.
 * @return {number}
 * @example
 *     2.5      ->  2.5
 *     2,5      ->  2.5
 *     2b.01    ->  2.01
 *     12.1234  ->  12.12
 */
export const sanitizeStringToNumber = (value: string): string => {
    const normalizedValue = value
        .trim()
        .replace(/,/g, ".")
        .replace(/[^\d.-]/g, "");
    const numericValue = parseFloat(normalizedValue);
    if (isNaN(numericValue)) return "0";
    return `${roundTo(numericValue, 2)}`;
};

export const queryStringToArray = (queryString: string): any => {
    const initialValue: any = {};
    const resultObject: any = {};
    const excludeKeys: string[] = ["_limit", "_page", "q", "_order", "_sort"];
    const query: any = String(queryString)
                                        .substr(1)
                                        .split('&')
                                        .reduce((prev, curr) => {
                                            const split = curr.split('=');
                                            const key = split[0];
                                            const value = decodeURIComponent(split[1]);
                                            prev[key] = value;
                                            return prev;
                                        }, initialValue);
    for (const key in query) {
        if (!excludeKeys.includes(key)) {
            resultObject[key] = query[key];
        }
    }
    return resultObject;
};

/**
 * Convierte un número en formato de cadena a un string con formato numérico.
 * La función utiliza el método toLocaleString para formatear el número con separadores de miles y dos dígitos decimales.
 * @param {number} numero - Número a formatear.
 * @return {string} - Número formateado como cadena.
 * @example
 *     formatearNumero(37657.82);    // Salida: "37,657.82"
 *     formatearNumero(2.5);         // Salida: "2.5"
 *     formatearNumero(2,5);         // Salida: "2.5"
 *     formatearNumero(2b.01);       // Salida: "2.01"
 *     formatearNumero(12.1234);     // Salida: "12.12"
 */

export function formatearNumero(numero: number, locale?: string): string {
    // Utiliza el método toLocaleString para formatear el número
    return numero.toLocaleString(locale??'de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * ['A', 'B', 'A', 'C']   =>   ['A', 'B', 'C']
 * @param lista Lista de cadenas de texto o números.
 */
export const eliminaRepetidos = <T>(lista: T[]): T[] => {
    return [...Array.from(new Set(lista))];
};

export const uniqueValues = (values: Array<string | null | undefined>): string[] => {
    return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
};

export const buildEntityMap = <T extends { id: string }>(items: T[]): Map<string, T> => {
    return new Map(items.map((item) => [item.id, item]));
};

/**
 * Elimina duplicados de una lista basada en el valor de una propiedad clave. * 
 * @param lista Lista de objetos a filtrar.
 * @param clave Propiedad clave por la cual se eliminarán duplicados.
 * @returns Una lista de objetos única basada en la clave.
 */
export const eliminaRepetidosPorClave = <T, K extends keyof T>(lista: T[], clave: K): T[] => {
    const mapa = new Map(lista.map((item) => [item[clave], item]));
    return Array.from(mapa.values());
};

/**
 * Convierte un número en su forma decimal.
 * 12     =>   12.00
 * 12.1   =>   12.10
 * 12.15  =>   12.15
 * 12.159 =>   12.15
 * @param value Número
 * @param nroDeciamles Cantidad de decimales
 */
export const numberToString = (value: number, nroDeciamles = 2) => {
    return value.toFixed(nroDeciamles);
};

/**
 * Descarga un archivo desde una URL
 * @param url URL del archivo
 * @param output Ruta donde se guardará el archivo
 */
export const downloadToFile = async (url: string, output: string) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(output);
        request({ uri: url, gzip: true })
            .pipe(file)
            .on("finish", () => {
                file.close();
                return resolve(output);
            })
            .on("error", (err) => {
                fs.unlinkSync(output);
                return reject(err);
            });
    });
};

/**
 * Descarga un archivo desde una URL. Devuelve el buffer del archivo.
 * @param url URL del archivo
 */
export const downloadToBuffer = async (url: string) => {
    return new Promise((resolve, reject) => {
        request({ url: url, encoding: null }, function (error, response, body) {
            if (error) return reject(error);
            resolve(body);
        });
    });
};

/**
 * Normaliza un texto.
 * @param {String} text - Cadena de texto.
 * @return {String} str
 * @example
 * Esta función normaliza un texto  ->  esta-funcion-normaliza-un-texto
 */
export const normalizeText = (text: string) => {
    let result = text.replace(/^\s+|\s+$/g, "").toLowerCase();
    const from = "ãàáäâèéëêìíïîõòóöôùúüûç·/_,:;";
    const to = "aaaaaeeeeiiiiooooouuuuc------";
    for (let i = 0; i < from.length; i++) {
        result = result.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }
    return result
        .replace(/[^a-z0-9ñ -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

/**
 * Simula una tarea durante un cierto periodo de tiempo.
 * @param timeout Tiempo en milisegundos
 */
export const timer = (timeout: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => resolve(), timeout));
};

export const construirNombre = (nombre?: string, primerApellido?: string, segundoApellido?: string): string => {
    const A = nombre ? nombre : "";
    const B = primerApellido ? primerApellido : "";
    const C = segundoApellido ? segundoApellido : "";
    return `${`${A} ${B}`.trim()} ${C}`.trim();
};

export const construirNombreConApellido = (
    nombre?: string,
    primerApellido?: string,
    segundoApellido?: string,
): string => {
    const A = nombre ? nombre : "";
    const B = primerApellido ? primerApellido : "";
    const C = segundoApellido ? segundoApellido : "";
    return `${`${A} ${B}`.trim()} ${C}`.trim();
};

export const construirNombrePorApellido = (
    nombre?: string,
    primerApellido?: string,
    segundoApellido?: string,
): string => {
    const A = primerApellido ? primerApellido : "";
    const B = segundoApellido ? segundoApellido : "";
    const C = nombre ? nombre : "";
    return `${`${A} ${B}`.trim()} ${C}`.trim();
};
interface NumerosALetras {
    (numero: number): string;
}

export const numeroALetras: NumerosALetras = (numero) => {
    const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const especiales = ['', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const centenas = ['', 'CIEN', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

    const convertirUnidades = (num: number): string => unidades[num];
    const convertirDecenas = (num: number): string => num < 10 ? convertirUnidades(num) : `${decenas[Math.floor(num / 10)]}${num % 10 !== 0 ? ` y ${convertirUnidades(num % 10)}` : ''}`;
    const convertirCentenas = (num: number): string => {
        if (num === 100) return 'CIEN';
        return `${num >= 100 ? (num >= 200 ? centenas[Math.floor(num / 100)] : 'CIENTO') : ''}${num % 100 !== 0 ? ` ${numeroALetras(num % 100)}` : ''}`;
    };

    const parteEntera = Math.floor(numero);
    const parteDecimal = Math.round((numero - parteEntera) * 100);

    let resultado = '';

    if (parteEntera === 0) {
        resultado += 'cero';
    } else if (parteEntera < 10) {
        resultado += convertirUnidades(parteEntera);
    } else if (parteEntera < 20) {
        resultado += especiales[parteEntera - 10];
    } else if (parteEntera < 100) {
        resultado += convertirDecenas(parteEntera);
    } else if (parteEntera < 1000) {
        resultado += convertirCentenas(parteEntera);
    } else {
        resultado += 'Número fuera de rango';
    }

    if (parteDecimal > 0) {
        resultado += ` con ${parteDecimal < 10 ? 'cero' : ''}${numeroALetras(parteDecimal)}`;
    }

    return resultado;
};
export function numeroALetras2(num: string): string {
    const unidades = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];

    function convertirCentenas(n: number): string {
        if (n === 0) return '';
        if (n <= 9) return unidades[n];
        if (n <= 19) return especiales[n - 10];
        if (n <= 99) {
            const dec = Math.floor(n / 10);
            const uni = n % 10;
            return `${decenas[dec]}${uni > 0 ? ' y ' + unidades[uni] : ''}`;
        }
        const cen = Math.floor(n / 100);
        const resto = n % 100;
        if (cen === 1 && resto === 0) return 'cien';
        return `${centenas[cen]} ${convertirCentenas(resto)}`.trim();
    }

    function convertirMiles(n: number): string {
        if (n < 1000) return convertirCentenas(n);
        const mil = Math.floor(n / 1000);
        const resto = n % 1000;
        if (mil === 1) return `mil ${convertirCentenas(resto)}`.trim();
        return `${convertirCentenas(mil)} mil ${convertirCentenas(resto)}`.trim();
    }

    function convertirMillones(n: number): string {
        if (n < 1000000) return convertirMiles(n);
        const millon = Math.floor(n / 1000000);
        const resto = n % 1000000;
        if (millon === 1) return `un millón ${convertirMiles(resto)}`.trim();
        return `${convertirCentenas(millon)} millones ${convertirMiles(resto)}`.trim();
    }

    const [entero, decimal] = num.split('.').map(Number);
    const parteEntera = convertirMillones(entero);
    const parteDecimal = decimal !== undefined ? `${decimal}/100` : '00/100';

    return `${parteEntera} ${parteDecimal}`;
}
export function getCurrentTime(): Date {
    return new Date();
}

export function isTimeInRange(inicio: Date, final: Date): boolean {
    const currentTime: Date = getCurrentTime();
    return moment(currentTime).isAfter(inicio) && moment(currentTime).isBefore(final);
}

export function isFechaActual(fecha: Date): boolean {
    const currentTime = getCurrentTime();
    return moment(currentTime).isSame(fecha, 'day');
}

export function contieneTrue(arr: boolean[]): boolean {
    return arr.some((valor) => valor === true);
}

interface Item {
    fecha: string; // Formato: "2023-08-02T22:03:45.000Z"
}

export const compareDateTime = (a: Item, b: Item): number => {
    const dateA = new Date(a.fecha);
    const dateB = new Date(b.fecha);
  
    return dateB.getTime() - dateA.getTime();
};

export const compararFechasEntre = (inicio: Date, actual: Date, limite: Date): number => {	
    const limiteNormalizado = new Date(limite.setHours(23,59,59,0));
    if (actual >= inicio && actual <= limiteNormalizado) {
        return 0; // La fecha actual está dentro del rango
    } else if (actual < inicio) {
        return -1; // La fecha actual es anterior al rango
    } else {
        return 1; // La fecha actual es posterior al rango
    }
}

// Función para verificar si un valor es una fecha válida
export const isValidDate = (value: string, format = 'YYYY-MM-DD'): boolean => {
    return moment(value, format, true).isValid();
};

// Función para comparar solo día, mes y año de dos fechas
export const compararFechas = (fecha1: Date, fecha2: Date): number => {
    const f1 = new Date(fecha1.getFullYear(), fecha1.getMonth(), fecha1.getDate());
    const f2 = new Date(fecha2.getFullYear(), fecha2.getMonth(), fecha2.getDate());
    
    // Si las fechas son iguales en día, mes y año, devolverá 0
    return f1.getTime() - f2.getTime();
}

export const compareFecha1esMayorIgualFecha2 = (fecha1: string, fecha2: string): boolean => {
    const dateA = new Date(fecha1);
    const dateB = new Date(fecha2);

    return dateA.getTime() >= dateB.getTime();
}

export const compareFecha1esMenorIgualFecha2 = (fecha1: string, fecha2: string): boolean => {
    const dateA = new Date(fecha1);
    const dateB = new Date(fecha2);

    return dateA.getTime() <= dateB.getTime();
}

export const compareFecha1esIgualFecha2 = (fecha1: string, fecha2: string): boolean => {
    const dateA = new Date(fecha1);
    const dateB = new Date(fecha2);

    return dateA.getTime() == dateB.getTime();
}

export function esFinDeSemana(fecha: Date) {
    const dia = fecha.getDay(); 
    return dia === 0 || dia === 6; 
}
interface Feriado {
    mes: number;
    dia: number;
}

export function obtenerFeriadosBoliviaOffline(anho: number, incluirSiguienteAnho: boolean) {
    // Feriados base con días y meses fijos (año es variable)
    /* const feriadosBase = [
        { mes: 1, dia: 1 },  // Año Nuevo
        { mes: 1, dia: 23 },  // Día de la Creación del Estado Plurinacional de Bolivia
        { mes: 2, dia: 16 }, // Carnaval (primer día)
        { mes: 2, dia: 17 }, // Carnaval (segundo día)
        { mes: 4, dia: 3 }, // Viernes Santo
        { mes: 5, dia: 1 },  // Día del Trabajo
        { mes: 6, dia: 4 }, // Corpus Christi
        { mes: 6, dia: 5 }, // Corpus Christi
        { mes: 6, dia: 22 }, // Año Nuevo Andino Amazónico Chaqueño
       // { mes: 8, dia: 2 },  // Día de la Revolución Agraria
        { mes: 8, dia: 6 },  // Día de la Independencia de Bolivia
        { mes: 8, dia: 7 },  // Día de la Independencia de Bolivia
        { mes: 11, dia: 2 }, // Día de los Difuntos
        { mes: 12, dia: 25 } // Navidad
    ]; */

    const feriadosBase: Feriado[] = process.env.FERIADOS_BASE
    ? JSON.parse(process.env.FERIADOS_BASE) as Feriado[]
    : [];

    let feriados = feriadosBase.map((feriado) => {
        return `${anho}-${feriado.mes.toString().padStart(2, '0')}-${feriado.dia.toString().padStart(2, '0')}`;
    });

    if (incluirSiguienteAnho) {
        const feriadosSiguienteAnho = feriadosBase.map((feriado) => {
            return `${(anho + 1)}-${feriado.mes.toString().padStart(2, '0')}-${feriado.dia.toString().padStart(2, '0')}`;
        });
        feriados = [...feriados, ...feriadosSiguienteAnho]; // Concatenar ambos años
    }

    return feriados;
}

export async function obtenerFeriadosBolivia() {
    const anho = new Date().getFullYear();
    const mesActual = new Date().getMonth() + 1; 
    let feriados: string[] = [];
   /* try {
        const responseActual = await axios.get(`${URL_FERIADOS}/${anho}/BO`);
        feriados = responseActual.data.map((feriado: any) => feriado.date);

        if (mesActual >= 9) {
            const responseSiguiente = await axios.get(`${URL_FERIADOS}/${anho + 1}/BO`);
            const feriadosSiguienteAnho = responseSiguiente.data.map((feriado: any) => feriado.date);
            feriados = [...feriados, ...feriadosSiguienteAnho]; // Concatenar ambos años
        }
        return feriados;*/
   // } catch (error) {
       // console.error('Error al obtener los feriados:', error);
        feriados = obtenerFeriadosBoliviaOffline(anho, mesActual >= 9);
        return feriados;
  //  }
}

export function esFeriado(fecha: Date, feriados: any[]) {
    if (!feriados) {
        console.log('No se pudo obtener la lista de feriados.');
        return false;
    }
    const fechaFormateada = fecha.toISOString().slice(0, 10).toString();
    return feriados.includes(fechaFormateada);
}

export function extractData(input: string): { area: string, name: string } {
    const openingParenIndex = input.indexOf('(');

    if (openingParenIndex === -1) {
        throw new Error("Input string is not in the expected format.");
    }

    const area = input.substring(0, openingParenIndex).trim();
    const name = input.substring(openingParenIndex + 1).trim();

    return { area, name };
}

export function calcularDias(fechaRegistro: Date, fechaDevolucion: Date): number {
    // Obtenemos la diferencia en milisegundos
    const diferenciaTiempo = fechaDevolucion.getTime() - fechaRegistro.getTime();
    
    // Convertimos de milisegundos a días
    const diferenciaDias = diferenciaTiempo / (1000 * 60 * 60 * 24);
    
    return Math.ceil(diferenciaDias); // Redondeamos hacia arriba para obtener días completos
}

export function parseDate(dateString: string): Date {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    return new Date(`${year}-${month}-${day}T${timePart}:00`);
}

export function formatArrayToString(arr: string[]): string {
    let arrayMotivoDeuda: string[] = [];
    try {
        arrayMotivoDeuda = Array.isArray(arr)
                                            ? arr
                                            : typeof arr === "string"
                                            ? JSON.parse(arr)
                                            : [];
    } catch (e) {
        arrayMotivoDeuda = [];
    }
    if(arrayMotivoDeuda.length > 0) {        
        const formattedArray = arrayMotivoDeuda.map((item) => item
                                                .toLowerCase()
                                                .replace(/_/g,' ')
                                                .replace(/^\w/, (char: string) => char.toUpperCase()))
        return formattedArray.join(', ');
    }
    return '';
}
