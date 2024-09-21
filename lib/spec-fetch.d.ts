import pacote from 'pacote';
import Arborist from '@npmcli/arborist';
import { Npmrcmap } from './npmrcmap.js';
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
    [pkgDir: string]: string;
};
/**
 * Fetches spec'ed packages to directories.
 */
export declare function fetchPkgs(
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
targetDir?: string | undefined): Promise<pacote.FetchResult[]>;
