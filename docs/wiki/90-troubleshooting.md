# Troubleshooting

## Container starts but page is blank

Check that port 8080 (or your chosen host port) is not already in use:

```bash
docker logs itsweber-tools
```

## Tool output is cut off in a pipe

If a downstream step receives metadata headers instead of clean data, the upstream tool may not set `rawOutput`. Check the tool's source in `packages/toolkit/src/tools/` and add a `rawOutput` field.

## Settings / pipes / history are lost after browser refresh

All state is stored in `localStorage` under the key prefix `itsweber-tools:`. If your browser is set to clear storage on close, state will not persist. Use a browser profile that retains localStorage, or export your pipes before clearing.

## CORS errors in the CORS Tester tool

The CORS Tester makes `fetch()` calls to external URLs from your browser. The target server must allow your browser's origin. This is expected behaviour — the tool tests whether the target allows cross-origin requests.

## Docker image fails to build with `--frozen-lockfile`

The `pnpm-lock.yaml` must be present and match `package.json`. Run `pnpm install` locally to regenerate the lockfile, then rebuild:

```bash
pnpm install
docker build -f docker/Dockerfile -t itsweber-tools:dev .
```

## nginx returns 403

The static files are served by a non-root user (`appuser`). If you mount a custom `nginx.conf` that changes the user directive, ensure the nginx worker process has read access to `/usr/share/nginx/html`.
