# Google Cloud Auth

You can use Google Cloud as an OIDC Provider to bring your Google users into Uptrace.

Single Sign-On allows to manage users using OIDC providers. After logging in, such users are automatically added to a team and can access team projects. When users are removed by the provider, they automatically lose granted access.

[[toc]]

## Uptrace Enterprise Edition

### Create Uptrace OIDC SSO

1. In Uptrace, go to your organization page and click on "Teams and Members".

2. At the bottom of the page, find the "Single Sign-On" section. Click on "New SSO" -> "New Google (OIDC)".

3. Fill out the form and click "Create".

![Uptrace Google OIDC](/google/uptrace-google-oidc.png)

4. On the next page, you will find the information required to configure Google OAuth client.

![Uptrace OIDC info](/google/uptrace-google-oidc-info.png)

### Create Google OAuth client

1. Visit [Google Cloud Console](https://console.cloud.google.com) and open "APIs & Services".

2. Open "Credentials" tab and click on "Create credentials" -> "OAuth client ID".

![Google OAuth client](/google/google-oauth-client-cloud.png)

3. Click on "Save" and you will be presented with the "Client ID" and "Client Secret" that you will need to complete Uptrace configuration.

4. Back in Uptrace, use the information you received on the previous step to complete the form by filling out "Client ID" and "Client Secret".

![Uptrace OAuth client](/google/uptrace-google-oidc-final.png)

---

## Uptrace Community Edition

1. Visit [Google Cloud Console](https://console.cloud.google.com) and open "APIs & Services".

2. Open "Credentials" tab and click on "Create credentials" -> "OAuth client ID".

![Google OAuth client](/google/google-oauth-client-community.png)

3. Click on "Save" and use information from the dialog window to finish configuring Uptrace.

```yaml
auth:
  oidc:
    - id: google
      display_name: Google
      issuer_url: https://accounts.google.com
      client_id: *****************-****************************.apps.googleusercontent.com
      client_secret: ********************
      claim: email
      scopes:
        - email
        - profile
```

If you are using a domain other than `localhost`, you also need to update `site.addr`:

```yaml
site:
  # Overrides public URL for Vue-powered UI in case you put Uptrace behind a proxy.
  addr: 'https://uptrace.mydomain.com'
```
