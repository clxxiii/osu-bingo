There is a lot of potential for potential cool ideas when it comes to this project, and while I’d love to implement them all, right now the focus is making it functional. So, while I am working on fixing everything, I am also using this space to write down any silly ideas I have that might give the game more flavor, and would allow the whole project to last longer.

## Silly Squares
- Current squares are tied to a specific map, and the claim condition for said map relies on setting a certain score on it.
- Silly squares are different in that they aren’t tied to any map, and can be claimed by any map that meets a certain specified requirement.
- Examples include, “Set a score worth exactly 111,111” or “Pass with a D rank on a map after 5 or more fails on the same difficulty”
- Ideally these requirements could be custom-made by the users, via some form of block coding, but that’s a huge stretch goal.

## Final Showdown
> This already exists in the database, but no logic is currently implemented.

In the event of a tie, simply calling the tie at “who won the most maps” is anticlimactic, and at worst, abusable. Final showdown is an alternative solution, in which the entire board becomes irrelevant, and the game is decided via one randomly selected map that everyone competes on at once to try and get the highest combined team score. After a few minutes, the team with the highest combined score wins.

## Powerups
While the randomness of maps keeps things somewhat interesting, games could get very boring if each one becomes “team A picks a line, team B picks a line, all members solve on that line”. Powerups can be distributed to a team to be used at any time to give themselves an advantage.

How these Powerups are distributed, I haven’t quite decided. My main idea is to have “square battles” where custom conditions appear on existing maps on the board, like “first pass with 20 50s” or “best accuracy after 5 minutes”

### Powerup Ideas:
- Tempest Painter: Selected square becomes claimed by your team, and all opponents scores on that square are removed
- Lock On: Selected square doesn’t accept new scores the next for 10 minutes
- Hammer: Select a square to remove from the game. This square accepts no new scores for the rest of the game, and lines including it do not count as a win.
- Lay a trap on selected square.
- Add a 2x multiplier to your next score
- Reroll a squares map and wipe all scores
- Add a mod requirement to a map
- Permanently mark a square as wild, counts as claimed for both teams