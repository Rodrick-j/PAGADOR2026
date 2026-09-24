export class BaseHttpError {
    private _message = "";
    private _code = 500;

    constructor(message: string, code: number) {
        this._message = message;
        this._code = code;
    }

    get message() {
        return this._message;
    }

    get code() {
        return this._code;
    }
}

export class BadRequest extends BaseHttpError {
    public static MESSAGE =
        "Hubo un error al procesar su solicitud, revise el formato en el envío de datos e inténtelo nuevamente";
    public static CODE = 400;

    constructor(message?: string) {
        super(message || BadRequest.MESSAGE, BadRequest.CODE);
    }
}

export class Unauthorized extends BaseHttpError {
    public static MESSAGE = "Debe autenticarse para acceder al recurso";
    public static CODE = 401;

    constructor(message?: string) {
        super(message || Unauthorized.MESSAGE, Unauthorized.CODE);
    }
}

export class Forbidden extends BaseHttpError {
    public static MESSAGE = "No cuenta con los privilegios suficientes para acceder al recurso";
    public static CODE = 403;

    constructor(message?: string) {
        super(message || Forbidden.MESSAGE, Forbidden.CODE);
    }
}

export class NotFound extends BaseHttpError {
    public static MESSAGE = "El servidor no puede encontrar el recurso solicitado";
    public static CODE = 404;

    constructor(message?: string) {
        super(message || NotFound.MESSAGE, NotFound.CODE);
    }
}

export class Conflict extends BaseHttpError {
    public static MESSAGE = "Hubo un error durante el proceso, inténtelo nuevamente";
    public static CODE = 409;

    constructor(message?: string) {
        super(message || Conflict.MESSAGE, Conflict.CODE);
    }
}

export class PreconditionFailed extends BaseHttpError {
    public static MESSAGE = "No se cumple con algunas condiciones que son necesarias para completar la tarea";
    public static CODE = 412;

    constructor(message?: string) {
        super(message || PreconditionFailed.MESSAGE, PreconditionFailed.CODE);
    }
}

export class InternalServerError extends BaseHttpError {
    public static MESSAGE = "Hubo un error inesperado, inténtelo más tarde";
    public static CODE = 500;

    constructor(message?: string) {
        super(message || InternalServerError.MESSAGE, InternalServerError.CODE);
    }
}
