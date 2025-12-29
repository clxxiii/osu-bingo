This service acts as the gateway between passing data between the database, and anywhere else. The primary mode of transport for this data is a GraphQL API, where nearly all data is exposed, and mutations can be made via [[Authentication]]

Features:

- GraphQL queries for all relevant data.
- Several mutations to change relevant data, which require authentication.
- A subscription service that allows clients to stream data from games in real time.
- A RabbitMQ message-passing system to keep multiple API containers in sync.