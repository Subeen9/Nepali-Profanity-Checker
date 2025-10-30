export type MatchOptions = {
    fuzzy?: boolean;
    maxDistance?: number;
    maxRatio?: number;
};
export declare function containsProfanity(input: unknown, opts?: MatchOptions): boolean;
export declare function findProfanities(input: unknown, opts?: MatchOptions): Array<{
    match: string;
    base?: string;
    category?: string[];
    index: number;
    fuzzy?: boolean;
}>;
export type CensorOptions = MatchOptions & {
    fuzzyCensor?: boolean;
};
export declare function censorProfanity(input: unknown, maskChar?: string, opts?: CensorOptions): string;
declare const _default: {
    containsProfanity: typeof containsProfanity;
    findProfanities: typeof findProfanities;
    censorProfanity: typeof censorProfanity;
};
export default _default;
//# sourceMappingURL=index.d.ts.map