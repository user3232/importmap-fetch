import pacote from 'pacote'
// needed for pacote git/dir resolver
import Arborist from '@npmcli/arborist'
import path from 'node:path'
import { Npmrcmap } from './npmrcmap.js'
import { pipableObjectFrom } from '@user3232/pipable'


/**
 * Maps packages real runtime paths to specs, e.g.:
 * 
 * ```json
 * {
 *   "node_modules/react": "npm:react@18.3.1",
 *   "node_modules/react-dom": "npm:react-dom@18.3.1"
 * }
 * ```
 */
export type Specmap = {
    [pkgDir: string]: string
}

/**
 * Fetches spec'ed packages to directories.
 */
export async function fetchPkgs(
    /**
     * NPM config options. Will be forwarded to {@link pacote.extract}.
     * 
     * > **Warning** NPM `keyfile` and `certfile`
     * > 
     * > {@link pacote.extract} ignores (as documented by Pacote in 2024) 
     * > some newer NPM's constructs, e.g. scoped `keyfile` and `certfile`. 
     * > Those could be polyfilled by clever usage of {@link pacote.Options.scope}, 
     * > {@link pacote.Options.spec}, obsolate NPM `cert` and `key` options but 
     * > {@link fetchPkgs} does not do this.
     */
    confmap: Npmrcmap,
    /**
     * NPM Arborist class, neccessary for fetching git packages.
     * Will be forwarded to {@link pacote.extract}.
     */
    arborist: typeof Arborist,
    /**
     * Package directory (relative to `targetDir`) to package spec
     * (instruction from where to fetch) map.
     */
    specmap: Specmap,
    /**
     * Root dir at which save packages.
     */
    targetDir?: string | undefined
): Promise<pacote.FetchResult[]> {
    targetDir ??= 'node_packages'

    const fetchResults = await pipableObjectFrom(specmap)
    .mapToAsyncArray(
        (pkgDir, pkgSpec) => pacote.extract(
            pkgSpec, 
            path.join(targetDir, pkgDir),
            {
                ...confmap,
                Arborist: arborist
            } satisfies ExtractOptions,
        )
    )
    .value
    
    return fetchResults
}


/**
 * {@link pacote.extract} options ({@link pacote.Options}). Those are:
 * * NPM config ({@link NpmConfig}) options (can be provided 
 *   by {@link npmrcmapFrom} function).
 * * and {@link Arborist} needed for git packages fetching.
 */
type ExtractOptions = PacoteExtractGitOptions & pacote.Options


/**
 * {@link pacote.extract} needs {@link pacote.Options} with 
 * {@link Arborist} to be able to fetch git packages.
 */
type PacoteExtractGitOptions = {
    Arborist: typeof Arborist,
}


