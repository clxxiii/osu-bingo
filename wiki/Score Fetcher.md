This service is the main game logic of the site. It takes the currently running games, and does everything it needs to do to run them.

Features:

- Subscribe to the list of active games and start polling for scores for active games.
- Queue up fetch events for users to fetch new scores for each user in an active game.
- Process new batch of scores where each square’s status is updated, and game wins are potentially calculated.
- Schedule and perform in game events like phase switches, square randomization,