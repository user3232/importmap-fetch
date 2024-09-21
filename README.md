# @user3232/importmap-fetch

API/CLI for fetching `package.json` like dependencies.


## Usage

Install:

```sh
npm i --save-dev user3232/importmap-fetch
```

Use:

```sh
# given in cwd we have "*.importmap.spec.json" file(s)
# with content: 
# { 
#   "react@18.3.1-YONJjkhld7ad": "npm:react@18.3.1",
#   "react-dom@18.3.1-EBbKJbk6jkUI": "npm:react-dom@18.3.1"
# }
# packages with appriopriate versions will be downloaded
# to appriopriate directories under "node_packages" directory.
npx importmap-fetch
```

That's it!.

