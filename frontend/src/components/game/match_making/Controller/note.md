# on invite 
- you get query like this `https://localhost:4433/match-making?player=ayoub`

- get the username from the qeury `ayoub`
- fetch user data from backend using that username
- utilize this function `UserDetailByUsername(username)`
- data retrieved from the backend you need to set it in the left card and add to it a fade animation to indicate is loading 
- on accept get the uuid from the wss and redirect user to 
example: `https://localhost:4433/game?uuid=acac9fa7-5015-4288-bae6-04618c68bd09`


