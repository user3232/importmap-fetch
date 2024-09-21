// src/cli.ts
import { glob } from "glob";

// src/spec-fetch.ts
import pacote from "pacote";
import path from "node:path";
import { pipableObjectFrom } from "@user3232/pipable";
async function fetchPkgs(confmap, arborist, specmap, targetDir) {
  targetDir ??= "node_packages";
  const fetchResults = await pipableObjectFrom(specmap).mapToAsyncArray(
    (pkgDir, pkgSpec) => pacote.extract(
      pkgSpec,
      path.join(targetDir, pkgDir),
      {
        ...confmap,
        Arborist: arborist
      }
    )
  ).value;
  return fetchResults;
}

// src/cli.ts
import Arborist from "@npmcli/arborist";
import fs from "node:fs";

// src/npmrcmap.ts
import NpmConfig from "@npmcli/config";
import NpmConfigDefs from "@npmcli/config/lib/definitions/index.js";
async function npmrcmapFrom(pkgDir) {
  const conf = new NpmConfig({
    npmPath: pkgDir,
    definitions: NpmConfigDefs.definitions,
    shorthands: NpmConfigDefs.shorthands
    // flatten: defs.flatten,
  });
  await conf.load();
  return Object.assign({}, ...conf.list.toReversed());
}

// src/cli.ts
var ImportmapExt = {
  spec: ".importmap.spec.json",
  local: ".importmap.local.json",
  global: ".importmap.global.json",
  bare: "."
};
async function cliFetch(cwd) {
  cwd ??= ".";
  const specsFiles = await glob(`*${ImportmapExt.spec}`, { cwd });
  if (specsFiles.length === 0) {
    console.log("Fetch: no importmap spec files. Nothing to do.");
    return;
  }
  console.log("Fetch: reading NPM configs.");
  const npmrcmap = await npmrcmapFrom(cwd);
  for (const specFile of specsFiles) {
    console.log(`Fetch: fetching ${specFile}`);
  }
  const fetches = specsFiles.map(async (specFile) => {
    const spec = JSON.parse(await fs.promises.readFile(
      specFile,
      { encoding: "utf8" }
    ));
    return fetchPkgs(
      npmrcmap,
      Arborist,
      spec
    );
  }).map(
    (fetch) => fetch.catch(
      (err) => new Error("Fetch: fetching problem!", { cause: err })
    )
  );
  const fetched = await Promise.all(fetches);
  const fetchesErrors = fetched.filter((fetch) => fetch instanceof Error);
  if (fetchesErrors.length !== 0) {
    console.log("Fetch: fetching problems!");
    fetchesErrors.forEach((fetchError) => console.log(fetchError));
  }
  console.log("Fetch: done.");
}
export {
  ImportmapExt,
  cliFetch,
  fetchPkgs,
  npmrcmapFrom
};
