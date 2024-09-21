export declare const ImportmapExt: {
    readonly spec: ".importmap.spec.json";
    readonly local: ".importmap.local.json";
    readonly global: ".importmap.global.json";
    readonly bare: ".";
};
export declare function cliFetch(cwd?: string | undefined): Promise<void>;
