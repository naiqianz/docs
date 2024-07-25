# Cloudflare Auth

[Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/) works by protecting a
subdomain like `uptrace.mydomain.com` under it. If the user is not logged in to Cloudflare Access,
Cloudflare will redirect the browser to `mydomain.cloudflareaccess.com` so the user can verify their
identity as required (PIN, GitHub login, etc.). Once Cloudflare authorizes the user for the
application, they are redirected back to `uptrace.mydomain.com`.

Since Cloudflare is a full MITM, it injects the `Cf-Access-Jwt-Assertion` on every request, as long
as the user is logged in. It also sets a cookie.

Uptrace config:

```yaml
auth:
  cloudflare:
    - team_url: https://mydomain.cloudflareaccess.com
      audience: 75940e2248f7135b7e3a6f9bf44bac3c1c7cae8539f98c4c7df6c08f37d92d33

site:
  # Overrides public URL for Vue-powered UI in case you put Uptrace behind a proxy.
  addr: 'https://uptrace.mydomain.com'
```
