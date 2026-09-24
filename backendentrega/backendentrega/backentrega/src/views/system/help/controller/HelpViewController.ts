import { BaseHttpController } from "../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import moment from "moment";

export class HelpViewController extends BaseHttpController {
    public async registrarLog(req: Request, res: Response): Promise<any> {
        try {
            const logTime = req.body.time ? req.body.time : moment().toISOString();
            const logData = req.body.data ? (Array.isArray(req.body.data) ? req.body.data : [req.body.data]) : [];
            const mDate = moment(logTime);
            const TIME = `${mDate.format("DD/MM/YYYY HH:mm:ss")}`;
            console.log("\x1b[33m" + `============= [web_client] [${TIME}] `.padEnd(62, "=") + "\x1b[36m");
            if (req.useragent && req.useragent.source) console.log("browser:       " + req.useragent.source);
            if (req.authId) console.log("userId:          " + req.authId);
            if (req.authUser && req.authUser.roles) console.log("rol: " + req.authUser.roles);
            console.log("\x1b[0m");
            for (const arg of logData) {
                const isStr = typeof arg === "string";
                const split = isStr ? String(arg).split("\n") : [];
                if (isStr) split.forEach((str) => console.log(`\x1b[33m${str}\x1b[0m`));
                if (!isStr) console.log(arg);
            }
            console.log("\x1b[33m" + "-".padEnd(62, "-") + "\x1b[0m");
            return res.status(200).send();
        } catch (err) {
            console.log("[FATAL] registrarLog", err);
            return res.status(200).send();
        }
    }
}
