# Use the Palantir

Introduction

---

<!--
Use
  Node
  Docker
-->

## Project setup
```bash
npm install
```

### Compiles and hot-reloads for development
```bash
npm run serve
```

### Compiles and minifies for production
```bash
npm run build
```

### Run your tests
```bash
npm run test
```

### Lints and fixes files
```bash
npm run lint
```

### Changelog to Timeline

```bash
palantir changelog "../my-project/CHANGELOG.md" "./my-project.json"
```

### Documentation generator

```bash
palantir doc "../my-project/{*.md,\!(node_modules)/**/*.md}" "./my-project" "../my-project/"
```

### Internal variables

```json
"variables": {
  "upgrade.button": false, // no upgrade button in the header
  "upgrade.reload": false  // no automatic reload when the server's version changed
}
```
