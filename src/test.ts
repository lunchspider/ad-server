import { useDatabase } from "./utils/useDatabase";

export async function saveData() {
    const prisma = useDatabase();
    let res = await prisma.tags.create({
        data: {
            name: "",
            publisher: "",
            advertiser: "",
            browser: "Firefox",
            deviceType: "desktop",
            version: "103.0",
            country: "",
            company: "companies/120404623",
            adServerUrl: "",
            statType: "",
            subids: [
                { subid: "1", limit: 1000, split: 70 },
                { subid: "2", limit: 1000, split: 70 },
            ],
            rotationType: "",
            url: "https://us.search.yahoo.com/yhs/search?hspart=abc&hsimp=yhs-asd&p=flowers",
            params: [
                {
                    key: "hspart",
                    value: "abc",
                    paramType: "",
                    initialParam: "",
                },
                {
                    key: "hsimp",
                    value: "yhs-asd",
                    paramType: "",
                    initialParam: "",
                },
                { key: "p", value: "flowers", paramType: "", initialParam: "" },
            ],
        },
    });
    console.log(res);
}

