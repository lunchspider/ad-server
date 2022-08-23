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
            const { id, subid } = req.params;
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
                return rejected();
            }
            if (
                tag.subids.find((val) => val.subid == subid)!.limit >
                getState().currentTotalTraffic
            ) {
                setState({
                    currentTotalTraffic: getState().currentTotalTraffic + 1,
                    currentAllowedTraffic: getState().currentAllowedTraffic + 1,
                });
                // continue query here
            } else {
                setState({
                    currentRejectedTraffic:
                        getState().currentRejectedTraffic + 1,
                    currentTotalTraffic: getState().currentTotalTraffic,
                });
                return rejected();
            }
            // phase 2 here
            res.json({ message: "yo everything is ok!!" });
        } catch (e) {
            return rejected();
        }
    }
}

export default SearchController;
