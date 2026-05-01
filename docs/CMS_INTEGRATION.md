# ItsWeber CMS Integration

ItsWeber Tools does not require the ItsWeber CMS. The integration contract is passive and non-invasive.

## Contract

- The CMS may request `/manifest.itsweber-tools.json`.
- The CMS may show the app name, logo, routes, and Docker metadata.
- The CMS must not overwrite its own active design to match ItsWeber Tools.
- ItsWeber Tools must remain installable on every regular Docker host without CMS dependencies.

## Manifest location

```text
/manifest.itsweber-tools.json
```

## Optional usage

- CMS admin field for a Tools base URL.
- CMS block that embeds the app when the user explicitly enables it.
- CMS navigation item generated from the manifest.
