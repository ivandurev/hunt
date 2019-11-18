# hunt
###### Hackathon project 
This is a project my team and I developed for 24 hours during the GreatUni hackathon in Manchester, UK. It won us the Booking.com award.

It is an online version of the game "Scavenger Hunt". Playing a game is simple. The website provides a clue which leads to a location. When you solve it and get to the correct destination the application will detect that and give you the next clue.

You can create new games which you and a team of reviewers manage. It is up to you to decide on the riddles, locations and order. You also decide who gets to join. Each time a user playing your game gets to a correct place he takes a picture and the reviewers or the creator decide whether it is authentic. 

There is login and register functionality but the UI needs improvements. Also, in order to run the application you need the correct database structure which is provided in the sql dump file.

The application depends on node.js and other packages part of it, which are listed in the `package.json` file
In order to run it just type:
```
node server.js
```
