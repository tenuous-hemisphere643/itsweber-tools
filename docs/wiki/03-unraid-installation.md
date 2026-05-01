# Unraid Installation

## Community App (recommended)

Search for **"ItsWeber Tools"** in the Unraid Community Applications plugin.

If it is not yet listed, use the manual template method below.

## Manual Template

1. Go to **Docker** → **Add Container**
2. Click **"Template repositories"** and add:  
   `https://github.com/itsweber-official/unraid-templates`
3. Select the **ItsWeber Tools** template
4. Set the host port (default: `8088`)
5. Click **Apply**

Or import the XML template directly from `docker/unraid/itsweber-tools.xml` in this repository.

## Manual Container Setup

| Field | Value |
| --- | --- |
| Repository | `ghcr.io/itsweber-official/itsweber-tools:latest` |
| Port mapping | `8088 → 80 (TCP)` |
| Restart policy | `unless-stopped` |
| Extra parameters | `--security-opt no-new-privileges:true` |
| Privileged | No |

No volumes required — all state is client-side (localStorage).

## Access

`http://[UNRAID-IP]:8088`
