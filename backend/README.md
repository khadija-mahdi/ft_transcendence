# BACKEND

### Game
- create tournament
- get (game or tournament) history, statue

### USER 
* invite users create looby for game 
   - if after 2 min invited user didn't join the game room kill the inviter
   - Appending users and accept users are broken

## tournament 
- join registered users to looby_tournament_<tournament_id>
   - randomly assign to every user an opponent
   - if some user does not have an opponent he get promoted to new round automatically
   - wait tell start time and then create games rooms and send link to all registered users

- every game ended the winner is added to bracket table
- when all games ended retrieve all winners and create match-up accordingly

# in game
 - every user stream hes moves and backend app stream back the position o the ball and score
 - score is stored in cache
 - when game is ended the score get flushed to db

# FRONTEND
- notification toast
- invitation toast

- ## Forms
    - create chat group
