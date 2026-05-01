# Release Checklist

- Run `pnpm lint`.
- Run `pnpm typecheck`.
- Run `pnpm test`.
- Run `pnpm build`.
- Build Docker image with `pnpm docker:build`.
- Run Docker image with `pnpm docker:run`.
- Open `http://localhost:8080` and test the app.
- Verify `/manifest.itsweber-tools.json`.
- Verify no telemetry, no external font/CDN requests, and no private data.
- Confirm license text and ownership before publishing.
- GitHub repository: https://github.com/itsweber-official/itsweber-tools
