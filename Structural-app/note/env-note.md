# Environment set up note

## init project

Init Nuxt3 project
> https://nuxt.com/docs/getting-started/installation
`npx nuxi@latest init <project-name>`
`npm install`

Setup Tauri
> https://tauri.app/v1/guides/getting-started/setup/integrate
`npm install --save-dev @tauri-apps/cli`

Add script in package.json
```json
"scripts": {
  "tauri": "tauri"
}
```

`npm run tauri init`

## develope command
Start Tauri Development Window 
`npm run tauri dev`

