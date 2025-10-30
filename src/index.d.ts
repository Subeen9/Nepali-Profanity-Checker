export declare function containsProfanity(input: unknown): boolean;
export declare function findProfanities(input: unknown): Array<{
    match: string;
    base?: string;
    category?: string[];
    index: number;
}>;
export declare function censorProfanity(input: unknown, maskChar?: string): string;
declare const _default: {
    containsProfanity: typeof containsProfanity;
    findProfanities: typeof findProfanities;
    censorProfanity: typeof censorProfanity;
};
export default _default;
//# sourceMappingURL=index.d.ts.map