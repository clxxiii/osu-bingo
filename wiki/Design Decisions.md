The following questions are considerations I'm taking into account as more of the design gets fleshed out. There aren't wrong answers, but each answer is a tradeoff, often complexity for efficiency. Writing them out lets me decide easier which option is better, so answers may be added or changed.

> [!QUESTION] Does one score fetcher service do all the updates for one game, or does it distribute the scores for each game?
> It should distribute the scores across each game. Imagine a case of two games, one with 50 players and one with 2, you don't want one server handling 50 players.

> [!QUESTION] Should the microservices use the same authentication as users do?
> Yes. I think what makes the most sense is for there to be a claim in the JWT as to whether or not the authentication token is a service or not. If it's a service, it bypasses the permission checking.
> Additionally, since these tokens are much more sensitive, they should expire much much quicker, and should not be allowed to be renewed

> [!QUESTION] Should we be using a database caching layer like REDIS for the game state?
> Yes. In progress games are fetched so frequently that the speed of the SQL database could really slow things down. Games that are in progress should be cached as regular JSON in a [REDIS](https://redis.io/) or similar database

