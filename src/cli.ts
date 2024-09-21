import { glob } from 'glob'
import { fetchPkgs } from './spec-fetch.js'
import Arborist from '@npmcli/arborist'
import fs from 'node:fs'
import { npmrcmapFrom } from './npmrcmap.js'



// await cliFetch('.')



export const ImportmapExt = {
    spec: '.importmap.spec.json',
    local: '.importmap.local.json',
    global: '.importmap.global.json',
    bare: '.',
} as const






export async function cliFetch(
    cwd?: string | undefined
): Promise<void> {
    cwd ??= '.'

    const specsFiles = await glob(`*${ImportmapExt.spec}`, {cwd})
    if(specsFiles.length === 0) {
        console.log('Fetch: no importmap spec files. Nothing to do.')
        return
    }

    
    console.log('Fetch: reading NPM configs.')
    const npmrcmap = await npmrcmapFrom(cwd)
    
    for(const specFile of specsFiles) {
        console.log(`Fetch: fetching ${specFile}`)
    }
    const fetches = specsFiles.map(async (specFile) => {
        const spec = JSON.parse(await fs.promises.readFile(
            specFile,
            {encoding: 'utf8'}
        ))
        return fetchPkgs(
            npmrcmap,
            Arborist,
            spec   
        )
    })
    .map((fetch) => fetch.catch(
        (err) => new Error('Fetch: fetching problem!', {cause: err}))
    )

    const fetched = await Promise.all(fetches)
    const fetchesErrors = fetched.filter((fetch) => fetch instanceof Error)
    if(fetchesErrors.length !== 0) {
        console.log('Fetch: fetching problems!')
        fetchesErrors.forEach((fetchError) => console.log(fetchError))
    }

    console.log('Fetch: done.')
}

