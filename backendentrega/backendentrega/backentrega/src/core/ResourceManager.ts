/* import */
import UsuarioService from "./system/autenticacion/usuario";
import PersonalService from "./rrhh/personal";

import { PersonalEntity } from "./rrhh/personal/PersonalEntity";
import { UsuarioEntity } from "./system/autenticacion/usuario/UsuarioEntity";

export class ResourceManager {
    /* entity */
    private _usuarios: UsuarioEntity[] | null = null;
    private _personals: PersonalEntity[] | null = null;

    private async getR<T>(currentResource: T[] | null, Service: any): Promise<T[]> {
        if (currentResource !== null) return currentResource;
        const result = await Service.getAll();
        if (result.isFailure) return [];
        return result.getValue() as T[];
    }

    /* promise entity */
    async usuarios(): Promise<UsuarioEntity[]> {
        this._usuarios = await this.getR(this._usuarios, UsuarioService);
        return this._usuarios;
    }

    async personals(): Promise<PersonalEntity[]> {
        this._personals = await this.getR(this._personals, PersonalService);
        return this._personals;
    }
}
