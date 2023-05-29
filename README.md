# Allentown
Hatch Social UI


## Generate Code Challenge

Go to https://developer.pingidentity.com/en/tools/pkce-code-generator.html, make sure SHA256 is selected, and click Generate New.  Copy the verifier and challenge codes.

## Get auth code from Auth0

Open browser and go to https://dev-8dzb1eft.us.auth0.com/authorize?response_type=code&code_challenge=**CODE CHALLENGE**&code_challenge_method=S256&client_id=jlBvShp2NFxVlAbupiY6k5ZHoxasoTjp&redirect_uri=org.social.hatch%3A%2F%2Fdev-8dzb1eft.us.auth0.com%2Fios%2Forg.social.hatch%2Fcallback&scope=openid offline_access profile email&state=hfhd7y34743hurfeh7f3h873fh8feg82d4g8&audience=https%3A%2F%2Fapi.hatch.social%2F .... should redirect to Auth0 login

### Log in

Test accounts:
test1@hatch.social / Test1!!!
test2@hatch.social / Test2!!!
test3@hatch.social / Test3!!!

### Check network tab in dev console for AUTHORIZATION CODE

Callback response will contain CODE and STATE parameters

## Get Access Token

Make a POST request to https://dev-8dzb1eft.us.auth0.com/oauth/token 

Body: 
{
    "grant_type": "authorization_code",
    "client_id": "jlBvShp2NFxVlAbupiY6k5ZHoxasoTjp",
    "code_verifier": **CODE VERIFIER**,
    "code": **AUTHORIZATION CODE**,
    "redirect_uri":"org.social.hatch://dev-8dzb1eft.us.auth0.com/ios/org.social.hatch/callback"
}

