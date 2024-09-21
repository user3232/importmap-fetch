// Computes effective config from npmrc's and command line
import NpmConfig from '@npmcli/config'
// Needed for npm config cli options parsing
// defs.definitions are types of cli arguments for npm
// defs.shorthands are commands shorthands names for npm
// @ts-expect-error
import NpmConfigDefs from '@npmcli/config/lib/definitions/index.js'



// const npmrcmap = await npmrcmapFrom('.')
// console.log(npmrcmap)




    

/**
 * Npm config options ({@link NpmConfig}) resolved down
 * to `cli`.
 * 
 * @see https://docs.npmjs.com/cli/v10/configuring-npm/npmrc#auth-related-configuration
 * @see https://docs.npmjs.com/cli/v10/using-npm/config
 * @see {@link pacote.Options}
 */
export type Npmrcmap = {
    [key: string]: null | boolean | number | string | any[]
}


/**
 * Resolves NPM config at provided `pkgDir` directory
 * and returns plain key-value map.
 */
export async function npmrcmapFrom(
    pkgDir: string,
): Promise<Npmrcmap> {
    /**
     * Valid configuration objects for NPM can be found in
     * ([config definitions directory](../node_modules/@npmcli/config/lib/definitions/index.js)).
     * 
     * Important configs are:
     * * {@link NpmConfig.definitions} - List of known NPM config parameters
     *   names and its possible types ([definitions.js](../node_modules/@npmcli/config/lib/definitions/definitions.js)),
     * * {@link NpmConfig.shorthands} list of NPM commands aliases.
     * 
     * {@link NpmConfig.npmPath} path at which resolve NPM config.
     */
    const conf = new NpmConfig({
        npmPath: pkgDir,
        definitions: NpmConfigDefs.definitions,
        shorthands: NpmConfigDefs.shorthands,
        // flatten: defs.flatten,
    })
    await conf.load()
    // make simple key-val map:
    return Object.assign({}, ...conf.list.toReversed()) as Npmrcmap
}

