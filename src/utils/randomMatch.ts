import "dotenv/config";

export const encryptMatch = async (id: number): Promise<string> => {
    return `${process.env.RANDOM}${id}${process.env.RANDOM}`;
};

export const decryptMatch = async (matche: string): Promise<number> => {
    const idString = matche.replace(`${process.env.RANDOM}`, "").replace(`${process.env.RANDOM}`, "");
    return parseInt(idString);
};
