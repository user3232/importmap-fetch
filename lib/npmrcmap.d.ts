/**
 * Npm config options ({@link NpmConfig}) resolved down
 * to `cli`.
 *
 * @see https://docs.npmjs.com/cli/v10/configuring-npm/npmrc#auth-related-configuration
 * @see https://docs.npmjs.com/cli/v10/using-npm/config
 * @see {@link pacote.Options}
 */
export type Npmrcmap = {
    [key: string]: null | boolean | number | string | any[];
};
/**
 * Resolves NPM config at provided `pkgDir` directory
 * and returns plain key-value map.
 */
export declare function npmrcmapFrom(pkgDir: string): Promise<Npmrcmap>;
