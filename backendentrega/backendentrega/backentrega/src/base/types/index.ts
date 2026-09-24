/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
declare namespace Express {
    // Agrega authId y userInfo al objeto Request
    // Ej:  const userId = req.authId;
    // Ej:  const administradorId = req.userInfo.administrador;
    export interface Request {
        authId: string;
        authUser: any;
        authError: string;
    }
}
