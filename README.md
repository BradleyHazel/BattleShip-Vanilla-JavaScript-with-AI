# BattleShip

https://bradleyhazel.github.io/

A vanilla JavaScript version of BattleShip with 
a simplified probablity map based AI. The user can drag and 
drop the ships onto their field, start the game to randomly
generate the enemy positions, and play round by round with 
AI until one side loses all of their ships. The play and the 
computer get to go again after a succesful hit.

![2022-03-18_18-53-21 (1)](https://user-images.githubusercontent.com/27248034/159103397-32bbff9d-1c89-4aa5-a781-fad9f63bb1e6.gif)
## Technology used
Vanilla JavaScript, HTML, CSS, Drag and Drop API

## User stories
As a User I want to be able to place my ships vertically or horizontally at the start of the game with a drag and drop mechanic.
As a User I want to be able to target a section of my enemies grid each round and if it is a hit, the ability to target again.
As a user I want to know when an enemy ship has sunk.
As a user I want to know when I have won or lost.
As a enemy, I want the AI to be able to sort of randomly select a target and if a hit occurs follow a logical hit selection process until a ship has sunk as well as follow the hit continuation logic.

## Wireframes
![image](https://user-images.githubusercontent.com/27248034/159103743-fd38dd5d-02a8-4b24-9503-20a107e8fc0c.png)

## Unsolved problems 
 The game could be simplified with some better abstraction of the game state.
 The AI could be slightly improved on succesive hits, currently only semi optimized.
 The optional typewritter effect option can break if the user goes to fast
 
## References used
Used for the drag and drop API
https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
Used for the typewriter effect
https://www.w3schools.com/howto/howto_js_typewriter.asp
Used for AI statistic reference: 
https://www.datagenetics.com/bloHuntg/december32011/index.html
https://cliambrown.com/battleship/ 
