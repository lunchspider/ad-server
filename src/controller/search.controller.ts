import Bowser from "bowser";
import { Tags } from "@prisma/client";
import { Request, Response, Router } from "express";
import { Controller } from "../types/controller";
import { useDatabase } from "../utils/useDatabase";
import { getState, setState } from "../utils/state";

class SearchController implements Controller {
    public router = Router();
    public path = "/search";
    constructor() {
        this.intializeRoutes();
    }
    public intializeRoutes(): void {
        this.router.get(this.path, this.search);
    }
    async search(req: Request, res: Response) {
        const rejected = () => {
            res.status(400).json({ message: "rejected!" });
        };
        try {
            const id : string = String(req.query.id);
            const subid : string = String(req.query.subid);
            if(!id || !subid){
                return rejected();
            }
            const ua = req.headers["user-agent"];
            if (!ua) {
                return rejected();
            }
            const prisma = useDatabase();
            const browser = Bowser.getParser(ua);
            let tag: Tags | null = await prisma.tags.findFirst({
                // requirements as such
                where: {
                    id: id,
                    browser: browser.getBrowser().name,
                    deviceType: browser.getPlatform().type,
                    version: browser.getBrowserVersion(),
                    subids: {
                        some: {
                            subid: subid,
                        },
                    },
                },
            });
            if (!tag) {
                // tag not found rejecting
                console.log("tag not found!");
                return rejected();
            }
            if (
                tag.subids.find((val) => val.subid == subid)!.limit >
                getState().currentTotalTraffic
            ) {
                console.log("we are here!");
                setState({
                    currentTotalTraffic: getState().currentTotalTraffic + 1,
                    currentAllowedTraffic: getState().currentAllowedTraffic + 1,
                });
            } else {
                console.log("limit reached!");
                setState({
                    currentRejectedTraffic:
                        getState().currentRejectedTraffic + 1,
                    currentTotalTraffic: getState().currentTotalTraffic,
                });
                return rejected();
            }
            // phase 2 here
            res.json(tag);
        } catch (e) {
            return rejected();
        }
    }
}

export default SearchController;
