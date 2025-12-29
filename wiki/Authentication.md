This service is responsible for letting users (or services) perform authenticated actions

### Features:
- Provide a REST API to login and logout, which create session tokens for users
- Allow the exchange of session tokens for JWTs which verify user identities
- Expose public keys of signed JWTs to allow services to verify identity
- Allow the fetching of osu! access tokens to perform authenticated actions with the osu! API

This service is capable of issuing two types of tokens, user and service tokens:
- **User tokens** are capable of being issued using a /login endpoint. They have a longer expiry, and are automatically exchanged for a newer token if the current one is set to expire soon. These tokens are also scoped so that certain actions are disallowed if a user shouldn't be able to do something.
- **Service Tokens** are only able to be issued internally using a RabbitMQ endpoint. A shared secret is established on creation of the authentication database, and the service uses that secret to request a signed JWT token. These tokens only last a few seconds, and are used to perform actions that bypass all authentication.


....or.... should I implement a scope system instead
maybe when I use this code for another service


---
*Whoever decided JWT should be pronounced as "jot" I respectfully think is very stupid*