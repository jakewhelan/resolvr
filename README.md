# @jakewhelan/resolvr

PM2 a/b test reverse proxy companion app - manage a/b test cookies and automagically configure nginx with proxy settings for PM2 instances in real-time

##TODO

- Decouple config modification from pm2 meta data collection
- Excempt Resolvr from a/b testing rules (add a fixed route in nginx.conf - /resolvr)
- Poll pm2 to watch for changes (1 min, 30 seconds?)
- Auto update nginx config, hot-reload with new proxy settings
- Add admin bar that shows a/b cookie is active, and which one
- Create config resolvr.yaml, allow to specify:
  - default app PM2 name (default route)
  - nginx config location
  - polling frequency