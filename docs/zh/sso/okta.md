# Okta Single Sign-On

You can use Okta as a SAML 2.0 Identity Provider to bring your Okta users into Uptrace.

Single Sign-On allows to manage users using SAML providers. After logging in, such users are automatically added to a team and can access team projects. When users are removed by the provider, they automatically lose granted access.

[[toc]]

## Create Uptrace SAML SSO

1. In Uptrace, go to your organization page and click on "Teams and Members".

2. At the bottom of the page, find the "Single Sign-On" section. Click on "New SSO" -> "New SAML".

3. Fill out the form and click "Create".

![Uptrace SAML](/okta/uptrace-saml-create.png)

4. On the next page, you will find the information required to configure Okta as a SAML identity provider.

![Uptrace service provider](/okta/uptrace-service-provider-info.png)

## Configure Okta as SAML identity provider

1. In Okta, go to "Applications" and click on "Create App Integration".

2. In the dialog window, select "SAML 2.0" and click "Next".

![Okta new app](/okta/okta-new-app.png)

3. In the "General Settings" tab, use "Uptrace" as the app name and click "Next".

![Okta general settings](/okta/okta-general-settings.png)

4. In the "Configure SAML" tab, use the service provider information you received from Uptrace to complete the form.

![Okta SAML settings](/okta/okta-saml-settings.png)

5. On the same page, scroll down to "Attribute Statements", and add the following:

![Okta Attributes](/okta/okta-attributes.png)

6. Click "Next" to go to the next page. There, select the following then click "Finish".

![Okta Feeback](/okta/okta-feedback.png)

7. You should land on the "Sign On" tab for your new application. This is where you will find the metadata URL you need to finish configuring Uptrace.

![Okta Metadata URL](/okta/okta-metadata-url.png)

## Finish configuring Uptrace

1. In Uptrace, go back to the SAML SSO you created at the start. Use the metadata URL you received from Okta to complete the form and click "Save".

![Uptrace metadata URL](/okta/uptrace-metadata-url.png)

2. Open `https://app.uptrace.dev/auth/sso/my.domain.com` to start the authentication flow using Okta as an identity provider.
