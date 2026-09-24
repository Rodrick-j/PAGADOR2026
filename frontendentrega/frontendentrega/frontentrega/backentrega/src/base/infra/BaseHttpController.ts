import { Response } from "express";
import {
    BaseHttpError,
    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound,
    Conflict,
    InternalServerError,
    PreconditionFailed,
} from "./HttpErrors";

export abstract class BaseHttpController {
    public static jsonErrorResponse(res: Response, code: number, error: string) {
        return res.status(code).json({ error });
    }

    public ok<T>(res: Response, dto?: T) {
        const data = typeof dto === "object" && dto !== null ? dto : {};
        return res.status(200).json(data);
    }

    public created(res: Response) {
        return res.sendStatus(201);
    }

    public badRequest(res: Response, message?: string) {
        return BaseHttpController.jsonErrorResponse(res, BadRequest.CODE, message ? message : BadRequest.MESSAGE);
    }

    public unauthorized(res: Response, message?: string) {
        return BaseHttpController.jsonErrorResponse(res, Unauthorized.CODE, message ? message : Unauthorized.MESSAGE);
    }

    public forbidden(res: Response, message?: string) {
        return BaseHttpController.jsonErrorResponse(res, Forbidden.CODE, message ? message : Forbidden.MESSAGE);
    }

    public notFound(res: Response, message?: string) {
        return BaseHttpController.jsonErrorResponse(res, NotFound.CODE, message ? message : NotFound.MESSAGE);
    }

    public conflict(res: Response, message?: string) {
        return BaseHttpController.jsonErrorResponse(res, Conflict.CODE, message ? message : Conflict.MESSAGE);
    }

    public preconditionFailed(res: Response, message?: string) {
        return BaseHttpController.jsonErrorResponse(
            res,
            PreconditionFailed.CODE,
            message ? message : PreconditionFailed.MESSAGE,
        );
    }

    public internalServerError(res: Response, message?: string) {
        return BaseHttpController.jsonErrorResponse(
            res,
            InternalServerError.CODE,
            message ? message : InternalServerError.MESSAGE,
        );
    }

    public fail(res: Response, error?: Error | string | BaseHttpError | null) {
        console.log(error);

        if (typeof error === "string" && error.startsWith("400")) return this.badRequest(res, error.substr(4));
        if (typeof error === "string" && error.startsWith("401")) return this.unauthorized(res, error.substr(4));
        if (typeof error === "string" && error.startsWith("403")) return this.forbidden(res, error.substr(4));
        if (typeof error === "string" && error.startsWith("404")) return this.notFound(res, error.substr(4));
        if (typeof error === "string" && error.startsWith("409")) return this.conflict(res, error.substr(4));
        if (typeof error === "string" && error.startsWith("412")) return this.preconditionFailed(res, error.substr(4));
        if (typeof error === "string" && error.startsWith("500")) return this.internalServerError(res, error.substr(4));

        if (error && error instanceof BaseHttpError) {
            return BaseHttpController.jsonErrorResponse(res, error.code, error.message);
        }

        return BaseHttpController.jsonErrorResponse(
            res,
            InternalServerError.CODE,
            error ? String(error) : InternalServerError.MESSAGE,
        );
    }
}
