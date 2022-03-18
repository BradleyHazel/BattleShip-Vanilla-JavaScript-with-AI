// dragstart_handler function and event listener code taken from https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
// https://www.w3schools.com/html/html5_draganddrop.asp
// https://sebhastian.com/javascript-rotate-images/#:~:text=When%20you%20need%20to%20rotate,element%20you%20want%20to%20rotate.&text=To%20rotate%20the%20image%2C%20you%20can%20select%20the%20element%20using%20document.
// typewriter effect https://www.w3schools.com/howto/howto_js_typewriter.asp
// https://www.w3schools.com/js/js_timing.asp
// for the AI portion https://www.datagenetics.com/bloHuntg/december32011/index.html AND https://cliambrown.com/battleship/ 

let smallShip = document.getElementById("smallShip");
let bigShip = document.getElementById("biggestShip"); 
let fourLongShip = document.getElementById("fourLongShip");
let threeShipOne =  document.getElementById("threeShipOne");
let threeShipTwo =  document.getElementById("threeShipTwo");

let useTyperWriter = false

let lastShipLocations=[];
let round = 0;
let shipcounter = 0




let probablityMap = {
    A1:8.0,  A2:11.5, A3:14.3, A4:15.9, A5:16.7, A6:16.7, A7:15.9, A8:14.3, A9:11.5, A10:8.0,
    B1:11.5, B2:14.3, B3:16.6, B4:17.8, B5:18.4, B6:18.4, B7:17.8, B8:16.6, B9:14.3, B10:11.5,
    C1:14.3, C2:16.6, C3:18.4, C4:19.4, C5:19.9, C6:19.9, C7:19.4, C8:18.4, C9:16.6, C10:14.3,
    D1:15.9, D2:17.8, D3:19.4, D4:20.3, D5:20.8, D6:20.8, D7:20.3, D8:19.4, D9:17.8, D10:15.9,
    E1:16.7, E2:18.4, E3:19.9, E4:20.8, E5:21.4, E6:21.4, E7:20.8, E8:19.9, E9:18.4, E10:16.7,
    F1:16.7, F2:18.4, F3:19.9, F4:20.8, F5:21.4, F6:21.4, F7:20.8, F8:19.9, F9:18.4, F10:16.7,
    G1:15.9, G2:17.8, G3:19.4, G4:20.3, G5:20.8, G6:20.8, G7:20.3, G8:19.4, G9:17.8, G10:15.9,
    H1:14.3, H2:16.6, H3:18.4, H4:19.4, H5:19.9, H6:19.9, H7:19.4, H8:18.4, H9:16.6, H10:14.3,
    I1:11.5, I2:14.3, I3:16.6, I4:17.8, I5:18.4, I6:18.4, I7:17.8, I8:16.6, I9:14.3, I10:11.5,
    J1:8.0,  J2:11.5, J3:14.3, J4:15.9, J5:16.7, J6:16.7, J7:15.9, J8:14.3, J9:11.5, J10:8.0
}
let listOfLetters = [`A1`,`A2`,`A3`,`A4`,`A5`,`A6`,`A7`,`A8`,`A9`,`A10`,
                     `B1`,`B2`,`B3`,`B4`,`B5`,`B6`,`B7`,`B8`,`B9`,`B10`,
                     `C1`,`C2`,`C3`,`C4`,`C5`,`C6`,`C7`,`C8`,`C9`,`C10`,
                     `D1`,`D2`,`D3`,`D4`,`D5`,`D6`,`D7`,`D8`,`D9`,`D10`,
                     `E1`,`E2`,`E3`,`E4`,`E5`,`E6`,`E7`,`E8`,`E9`,`E10`,
                     `F1`,`F2`,`F3`,`F4`,`F5`,`F6`,`F7`,`F8`,`F9`,`F10`,
                     `G1`,`G2`,`G3`,`G4`,`G5`,`G6`,`G7`,`G8`,`G9`,`G10`,
                     `H1`,`H2`,`H3`,`H4`,`H5`,`H6`,`H7`,`H8`,`H9`,`H10`,
                     `I1`,`I2`,`I3`,`I4`,`I5`,`I6`,`I7`,`I8`,`I9`,`I10`,
                     `J1`,`J2`,`J3`,`J4`,`J5`,`J6`,`J7`,`J8`,`J9`,`J10`,
                    ]

                    let maxProb = 0;
                    let maxProbSpace;



function toggleTypeWriter(){
    if(useTyperWriter){
    document.getElementById("toggle").innerHTML = "TypeWritter Effect: Off"
    useTyperWriter = false
    }
    else {
        document.getElementById("toggle").innerHTML = "TypeWritter Effect: On"
        useTyperWriter = true
    }
}


document.getElementById('startbutton').style.visibility = 'hidden';


// fancy effect here

var ivariable = 0;
var animatedText = 'Place your ships by dragging and dropping them onto the battlefield. Double click to rotate a ship.'; /* The text */
var speed = 40; /* The speed/duration of the effect in milliseconds */

function typeWriter() {
    if(useTyperWriter == true){
  if (ivariable < animatedText.length) {
    document.getElementById("message").innerHTML += animatedText.charAt(ivariable);
    ivariable++;
    setTimeout(typeWriter, speed);
  }
}
    else{
        document.getElementById("message").innerHTML = animatedText;
    }
}
typeWriter()


// allowing the drop to happen on divs by preventing default on the drag over
function allowDrop(ev) {
    // typicall does not allow drop so we prevent default
    ev.preventDefault();
  }

function drag(ev) {
    // setting the target Id on drag datatransfer
    ev.dataTransfer.setData("text", ev.target.id);
    console.log(ev.target.id)
    // clearing out the lastshiplocation incase the user just drags
    while(lastShipLocations.length>0){
        lastShipLocations.pop()
    }
    //////////////////// SMALL SHIP
    // getting the last ship location from the drag event, I think this is fine to do here since it resets 
    if(ev.target.id == `smallShip`){
        if(smallShip.attributes[5].nodeValue == `horizontal`){
            
            let firstPosition = ev.target.parentElement.id;
            let secondaryPosition;
            
                
            if(firstPosition[0]=='A'){secondaryPosition=`A`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='B'){secondaryPosition=`B`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='C'){secondaryPosition=`C`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='D'){secondaryPosition=`D`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='E'){secondaryPosition=`E`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='F'){secondaryPosition=`F`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='G'){secondaryPosition=`G`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='H'){secondaryPosition=`H`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='I'){secondaryPosition=`I`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='J'){secondaryPosition=`J`+firstPosition.slice(1,firstPosition.length)}
            firstPosition = `${secondaryPosition.slice(0,1)}${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`;
            console.log(firstPosition)
            console.log(secondaryPosition)
            lastShipLocations.push(firstPosition);
            lastShipLocations.push(secondaryPosition);
            
            
        }
        //// IF VERTICAL AND SMALL SHIP
        else{
        lastShipLocations.push(ev.target.parentElement);
        let firstPosition = ev.target.parentElement.id;
        let secondaryPosition;
        if(firstPosition[0]=='A'){secondaryPosition=`B`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='B'){secondaryPosition=`C`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='C'){secondaryPosition=`D`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='D'){secondaryPosition=`E`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='E'){secondaryPosition=`F`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='F'){secondaryPosition=`G`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='G'){secondaryPosition=`H`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='H'){secondaryPosition=`I`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='I'){secondaryPosition=`J`+firstPosition.slice(1,firstPosition.length)}
    
    lastShipLocations.push(document.getElementById(secondaryPosition));
    round =0;
    }
    }
    //////////////////// BIG SHIP
    // the big ship handling section
    else if(ev.target.id == `biggestShip`){
        if(bigShip.attributes[5].nodeValue == `horizontal`){

            lastShipLocations.push(ev.target.parentElement)
            let firstPosition 
            let secondaryPosition;
            let thirdPosition = ev.target.parentElement.id;
            let fourthPosition;
            let fifthPosition;

            if(thirdPosition[0]=='A'){
                secondaryPosition=`A${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                firstPosition=`A${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                fourthPosition=`A${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                fifthPosition=`A${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`
             }
                else if(thirdPosition[0]=='B'){
                    secondaryPosition=`B${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                    firstPosition=`B${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                    fourthPosition=`B${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                    fifthPosition=`B${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
                else if(thirdPosition[0]=='C'){
                    secondaryPosition=`C${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                    firstPosition=`C${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                    fourthPosition=`C${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                    fifthPosition=`C${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
                else if(thirdPosition[0]=='D'){
                    secondaryPosition=`D${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                    firstPosition=`D${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                    fourthPosition=`D${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                    fifthPosition=`D${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
                else if(thirdPosition[0]=='E'){
                    secondaryPosition=`E${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                    firstPosition=`E${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                    fourthPosition=`E${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                    fifthPosition=`E${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
                else if(thirdPosition[0]=='F'){
                    secondaryPosition=`F${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                    firstPosition=`F${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                    fourthPosition=`F${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                    fifthPosition=`F${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
                    else if(thirdPosition[0]=='G'){
                        secondaryPosition=`G${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                        firstPosition=`G${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                        fourthPosition=`G${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                        fifthPosition=`G${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
                        else if(thirdPosition[0]=='H'){
                            secondaryPosition=`H${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                            firstPosition=`H${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                            fourthPosition=`H${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                            fifthPosition=`H${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
                            else if(thirdPosition[0]=='I'){
                                secondaryPosition=`I${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                                firstPosition=`I${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                                fourthPosition=`I${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                                fifthPosition=`I${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
                                else if(thirdPosition[0]=='J'){
                                    secondaryPosition=`J${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                                    firstPosition=`J${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                                    fourthPosition=`J${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                                    fifthPosition=`J${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}

                                lastShipLocations.push(document.getElementById(secondaryPosition));
                                lastShipLocations.push(document.getElementById(firstPosition));
                                lastShipLocations.push(document.getElementById(fourthPosition));
                                lastShipLocations.push(document.getElementById(fifthPosition));


        }
        // vertical
        else{
    
        lastShipLocations.push(ev.target.parentElement);
        let firstPosition;
        let secondaryPosition;
        let thirdPosition = ev.target.parentElement.id;
        let fourthPosition;
        let fifthPosition;
        if(thirdPosition[0]=='C'){
            firstPosition=`A`+thirdPosition.slice(1,thirdPosition.length);
            secondaryPosition=`B`+thirdPosition.slice(1,thirdPosition.length)

            fourthPosition=`D`+thirdPosition.slice(1,thirdPosition.length);
            fifthPosition=`E`+thirdPosition.slice(1,thirdPosition.length);
         }
            else if(thirdPosition[0]=='D'){
            firstPosition=`B`+thirdPosition.slice(1,thirdPosition.length);
            secondaryPosition=`C`+thirdPosition.slice(1,thirdPosition.length)
            
            fourthPosition=`E`+thirdPosition.slice(1,thirdPosition.length);
            fifthPosition=`F`+thirdPosition.slice(1,thirdPosition.length);}
            else if(thirdPosition[0]=='E'){
                firstPosition=`C`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`D`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`F`+thirdPosition.slice(1,thirdPosition.length);
                fifthPosition=`G`+thirdPosition.slice(1,thirdPosition.length);}
            else if(thirdPosition[0]=='F'){
                firstPosition=`D`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`E`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`G`+thirdPosition.slice(1,thirdPosition.length);
                fifthPosition=`H`+thirdPosition.slice(1,thirdPosition.length);}
            else if(thirdPosition[0]=='G'){
                firstPosition=`E`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`F`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`H`+thirdPosition.slice(1,thirdPosition.length);
                fifthPosition=`I`+thirdPosition.slice(1,thirdPosition.length);}
            else if(thirdPosition[0]=='H'){
                firstPosition=`F`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`G`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`I`+thirdPosition.slice(1,thirdPosition.length);
                fifthPosition=`J`+thirdPosition.slice(1,thirdPosition.length);}
        
        lastShipLocations.push(document.getElementById(secondaryPosition));
        lastShipLocations.push(document.getElementById(firstPosition));
        lastShipLocations.push(document.getElementById(fourthPosition));
        lastShipLocations.push(document.getElementById(fifthPosition));
    }
    }
    else if(ev.target.id == `fourLongShip`){
    
        if(fourLongShip.attributes[5].nodeValue == `horizontal`){

            lastShipLocations.push(ev.target.parentElement)
            let firstPosition 
            let secondaryPosition;
            let thirdPosition = ev.target.parentElement.id;
            let fourthPosition;
            

            if(thirdPosition[0]=='A'){
                secondaryPosition=`A${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                firstPosition=`A${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                fourthPosition=`A${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
             }
                else if(thirdPosition[0]=='B'){
                    secondaryPosition=`B${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                    firstPosition=`B${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                    fourthPosition=`B${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
                else if(thirdPosition[0]=='C'){
                    secondaryPosition=`C${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                    firstPosition=`C${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                    fourthPosition=`C${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
                else if(thirdPosition[0]=='D'){
                    secondaryPosition=`D${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                    firstPosition=`D${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                    fourthPosition=`D${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
                else if(thirdPosition[0]=='E'){
                    secondaryPosition=`E${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                    firstPosition=`E${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                    fourthPosition=`E${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
                else if(thirdPosition[0]=='F'){
                    secondaryPosition=`F${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                    firstPosition=`F${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                    fourthPosition=`F${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
                    else if(thirdPosition[0]=='G'){
                        secondaryPosition=`G${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                        firstPosition=`G${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                        fourthPosition=`G${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
                        else if(thirdPosition[0]=='H'){
                            secondaryPosition=`H${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                            firstPosition=`H${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                            fourthPosition=`H${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
                            else if(thirdPosition[0]=='I'){
                                secondaryPosition=`I${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                                firstPosition=`I${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                                fourthPosition=`I${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
                                else if(thirdPosition[0]=='J'){
                                    secondaryPosition=`J${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                                    firstPosition=`J${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                                    fourthPosition=`J${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}

                                lastShipLocations.push(document.getElementById(secondaryPosition));
                                lastShipLocations.push(document.getElementById(firstPosition));
                                lastShipLocations.push(document.getElementById(fourthPosition));
        }
        // vertical
        else{
    
        lastShipLocations.push(ev.target.parentElement);
        let firstPosition;
        let secondaryPosition;
        let thirdPosition = ev.target.parentElement.id;
        let fourthPosition;

        if(thirdPosition[0]=='C'){
            firstPosition=`A`+thirdPosition.slice(1,thirdPosition.length);
            secondaryPosition=`B`+thirdPosition.slice(1,thirdPosition.length)

            fourthPosition=`D`+thirdPosition.slice(1,thirdPosition.length);
         }
            else if(thirdPosition[0]=='D'){
            firstPosition=`B`+thirdPosition.slice(1,thirdPosition.length);
            secondaryPosition=`C`+thirdPosition.slice(1,thirdPosition.length)
            
            fourthPosition=`E`+thirdPosition.slice(1,thirdPosition.length);}
            else if(thirdPosition[0]=='E'){
                firstPosition=`C`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`D`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`F`+thirdPosition.slice(1,thirdPosition.length);}
            else if(thirdPosition[0]=='F'){
                firstPosition=`D`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`E`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`G`+thirdPosition.slice(1,thirdPosition.length);
                }
            else if(thirdPosition[0]=='G'){
                firstPosition=`E`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`F`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`H`+thirdPosition.slice(1,thirdPosition.length);
               }
            else if(thirdPosition[0]=='H'){
                firstPosition=`F`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`G`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`I`+thirdPosition.slice(1,thirdPosition.length);
                }
                else if(thirdPosition[0]=='I'){
                    firstPosition=`G`+thirdPosition.slice(1,thirdPosition.length);
                    secondaryPosition=`H`+thirdPosition.slice(1,thirdPosition.length)
                    
                    fourthPosition=`J`+thirdPosition.slice(1,thirdPosition.length);
                    }
        
        lastShipLocations.push(document.getElementById(secondaryPosition));
        lastShipLocations.push(document.getElementById(firstPosition));
        lastShipLocations.push(document.getElementById(fourthPosition));
    }
    }

    else if(ev.target.id == `threeShipOne`){
    
        if(threeShipOne.attributes[5].nodeValue == `horizontal`){

            lastShipLocations.push(ev.target.parentElement)

            let firstPosition 
            let secondaryPosition = ev.target.parentElement.id;
            let thirdPosition 
            

            if(secondaryPosition[0]=='A'){
                firstPosition=`A${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                thirdPosition=`A${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
             }
                else if(secondaryPosition[0]=='B'){
                    firstPosition=`B${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                    thirdPosition=`B${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0]=='C'){
                    firstPosition=`C${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                    thirdPosition=`C${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0]=='D'){
                    firstPosition=`D${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                    thirdPosition=`D${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0]=='E'){
                    firstPosition=`E${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                    thirdPosition=`E${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0]=='F'){
                    firstPosition=`F${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                    thirdPosition=`F${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                    else if(secondaryPosition[0]=='G'){
                        firstPosition=`G${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                        thirdPosition=`G${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                        else if(secondaryPosition[0]=='H'){
                            firstPosition=`H${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                            thirdPosition=`H${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                            else if(secondaryPosition[0]=='I'){
                                firstPosition=`I${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                                thirdPosition=`I${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                                else if(secondaryPosition[0]=='J'){
                                    firstPosition=`J${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                                    thirdPosition=`J${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}

                                lastShipLocations.push(document.getElementById(thirdPosition));
                                lastShipLocations.push(document.getElementById(firstPosition));

                              
        }
        // vertical
        else{
    
        lastShipLocations.push(ev.target.parentElement);
        let firstPosition;
        let secondaryPosition = ev.target.parentElement.id;
        let thirdPosition 

        if(secondaryPosition[0]=='B'){
            firstPosition=`A`+secondaryPosition.slice(1,secondaryPosition.length);
            thirdPosition=`C`+secondaryPosition.slice(1,secondaryPosition.length)
         }
            else if(secondaryPosition[0]=='C'){
                firstPosition=`B`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`D`+secondaryPosition.slice(1,secondaryPosition.length)
             }
            else if(secondaryPosition[0]=='D'){
                firstPosition=`C`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`E`+secondaryPosition.slice(1,secondaryPosition.length)
             }
            else if(secondaryPosition[0]=='E'){
                firstPosition=`D`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`F`+secondaryPosition.slice(1,secondaryPosition.length)
             }
            else if(secondaryPosition[0]=='F'){
                firstPosition=`E`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`G`+secondaryPosition.slice(1,secondaryPosition.length)
             }
            else if(secondaryPosition[0]=='G'){
                firstPosition=`F`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`H`+secondaryPosition.slice(1,secondaryPosition.length)
             }
                else if(secondaryPosition[0]=='H'){
                    firstPosition=`G`+secondaryPosition.slice(1,secondaryPosition.length);
                    thirdPosition=`I`+secondaryPosition.slice(1,secondaryPosition.length)
                 }
                 else if(secondaryPosition[0]=='I'){
                    firstPosition=`H`+secondaryPosition.slice(1,secondaryPosition.length);
                    thirdPosition=`J`+secondaryPosition.slice(1,secondaryPosition.length)
                 }
        
        lastShipLocations.push(document.getElementById(firstPosition));
        lastShipLocations.push(document.getElementById(thirdPosition));
    }
    }
    else if(ev.target.id == `threeShipTwo`){


        if(threeShipTwo.attributes[5].nodeValue == `horizontal`){

            lastShipLocations.push(ev.target.parentElement)

            let firstPosition 
            let secondaryPosition = ev.target.parentElement.id;
            let thirdPosition 
            

            if(secondaryPosition[0]=='A'){
                firstPosition=`A${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                thirdPosition=`A${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
             }
                else if(secondaryPosition[0]=='B'){
                    firstPosition=`B${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                    thirdPosition=`B${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0]=='C'){
                    firstPosition=`C${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                    thirdPosition=`C${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0]=='D'){
                    firstPosition=`D${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                    thirdPosition=`D${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0]=='E'){
                    firstPosition=`E${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                    thirdPosition=`E${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0]=='F'){
                    firstPosition=`F${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                    thirdPosition=`F${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                    else if(secondaryPosition[0]=='G'){
                        firstPosition=`G${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                        thirdPosition=`G${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                        else if(secondaryPosition[0]=='H'){
                            firstPosition=`H${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                            thirdPosition=`H${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                            else if(secondaryPosition[0]=='I'){
                                firstPosition=`I${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                                thirdPosition=`I${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                                else if(secondaryPosition[0]=='J'){
                                    firstPosition=`J${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                                    thirdPosition=`J${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}

                                lastShipLocations.push(document.getElementById(thirdPosition));
                                lastShipLocations.push(document.getElementById(firstPosition));

                              
        }
        // vertical
        else{
    
        lastShipLocations.push(ev.target.parentElement);
        let firstPosition;
        let secondaryPosition = ev.target.parentElement.id;
        let thirdPosition 

        if(secondaryPosition[0]=='B'){
            firstPosition=`A`+secondaryPosition.slice(1,secondaryPosition.length);
            thirdPosition=`C`+secondaryPosition.slice(1,secondaryPosition.length)
         }
            else if(secondaryPosition[0]=='C'){
                firstPosition=`B`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`D`+secondaryPosition.slice(1,secondaryPosition.length)
             }
            else if(secondaryPosition[0]=='D'){
                firstPosition=`C`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`E`+secondaryPosition.slice(1,secondaryPosition.length)
             }
            else if(secondaryPosition[0]=='E'){
                firstPosition=`D`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`F`+secondaryPosition.slice(1,secondaryPosition.length)
             }
            else if(secondaryPosition[0]=='F'){
                firstPosition=`E`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`G`+secondaryPosition.slice(1,secondaryPosition.length)
             }
            else if(secondaryPosition[0]=='G'){
                firstPosition=`F`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`H`+secondaryPosition.slice(1,secondaryPosition.length)
             }
                else if(secondaryPosition[0]=='H'){
                    firstPosition=`G`+secondaryPosition.slice(1,secondaryPosition.length);
                    thirdPosition=`I`+secondaryPosition.slice(1,secondaryPosition.length)
                 }
                 else if(secondaryPosition[0]=='I'){
                    firstPosition=`H`+secondaryPosition.slice(1,secondaryPosition.length);
                    thirdPosition=`J`+secondaryPosition.slice(1,secondaryPosition.length)
                 }
        
        lastShipLocations.push(document.getElementById(firstPosition));
        lastShipLocations.push(document.getElementById(thirdPosition));
    }


    }
  }
  
  function drop(ev) {
    ev.preventDefault();
    console.log(ev.path[0].id)
    
    
    // getting the target ID from the drag function that set the data
    var data = ev.dataTransfer.getData("text");
    // printing the event for trouble shooting

    // error handling for dropping on top of another ship
    if(data == `smallShip`){
        if(smallShip.attributes[5].nodeValue == `horizontal`){
            //
            let firstpos = ev.path[0].id;
            let secondpos = `${firstpos.slice(0,1)}${parseInt(firstpos.slice(1,firstpos.length))-1}`
            if(document.getElementById(firstpos).attributes[4].value == `true` 
            || document.getElementById(secondpos).attributes[4].value == `true`
               ){   
                   return console.log(false)

               }
        }
        // vertical
        else{
            let firstpos = ev.path[0].id;
            let secondpos;
            if(firstpos.slice(0,1) == `A`){secondpos=`B${firstpos.slice(1,firstpos.length)}`}
            else if(firstpos.slice(0,1) == `B`){secondpos=`C${firstpos.slice(1,firstpos.length)}`}
            else if(firstpos.slice(0,1) == `C`){secondpos=`D${firstpos.slice(1,firstpos.length)}`}
            else if(firstpos.slice(0,1) == `D`){secondpos=`E${firstpos.slice(1,firstpos.length)}`}
            else if(firstpos.slice(0,1) == `E`){secondpos=`F${firstpos.slice(1,firstpos.length)}`}
            else if(firstpos.slice(0,1) == `F`){secondpos=`G${firstpos.slice(1,firstpos.length)}`}
            else if(firstpos.slice(0,1) == `G`){secondpos=`H${firstpos.slice(1,firstpos.length)}`}
            else if(firstpos.slice(0,1) == `H`){secondpos=`I${firstpos.slice(1,firstpos.length)}`}
            else if(firstpos.slice(0,1) == `I`){secondpos=`J${firstpos.slice(1,firstpos.length)}`}
            if(document.getElementById(firstpos).attributes[4].value == `true` 
            || document.getElementById(secondpos).attributes[4].value == `true`
               ){   
                   return console.log(false)

               }
        }
    }

    if(data == `fourLongShip`){
            if(fourLongShip.attributes[5].nodeValue == `horizontal`){
                //

                let firstpos;
                let secondpos;
                let thirdpos = ev.path[0].id;
                let fourthpos;

                
                firstpos = `${thirdpos.slice(0,1)}${parseInt(thirdpos.slice(1,thirdpos.length))+2}`
                secondpos = `${thirdpos.slice(0,1)}${parseInt(thirdpos.slice(1,thirdpos.length))+1}`
                fourthpos = `${thirdpos.slice(0,1)}${parseInt(thirdpos.slice(1,thirdpos.length))-1}`

                if(document.getElementById(firstpos).attributes[4].value == `true` 
                || document.getElementById(secondpos).attributes[4].value == `true`
                || document.getElementById(thirdpos).attributes[4].value == `true`
                || document.getElementById(fourthpos).attributes[4].value == `true`
                   ){   
                       return console.log(false)
    
                   }
            }
            // vertical
            else{
                let firstpos;
                let secondpos;
                let thirdpos = ev.path[0].id;
                let fourthpos;

                if(thirdpos.slice(0,1) == `C`){
                    firstpos =`A${thirdpos.slice(1,thirdpos.length)}`
                    secondpos =`B${thirdpos.slice(1,thirdpos.length)}`
                    fourthpos =`D${thirdpos.slice(1,thirdpos.length)}`
                }
                else if(thirdpos.slice(0,1) == `D`){
                    firstpos =`B${thirdpos.slice(1,thirdpos.length)}`
                    secondpos =`C${thirdpos.slice(1,thirdpos.length)}`
                    fourthpos =`E${thirdpos.slice(1,thirdpos.length)}`
                }
                else if(thirdpos.slice(0,1) == `E`){
                    firstpos =`C${thirdpos.slice(1,thirdpos.length)}`
                    secondpos =`D${thirdpos.slice(1,thirdpos.length)}`
                    fourthpos =`F${thirdpos.slice(1,thirdpos.length)}`
                }
                else if(thirdpos.slice(0,1) == `F`){
                    firstpos =`D${thirdpos.slice(1,thirdpos.length)}`
                    secondpos =`E${thirdpos.slice(1,thirdpos.length)}`
                    fourthpos =`G${thirdpos.slice(1,thirdpos.length)}`
                }
                else if(thirdpos.slice(0,1) == `G`){
                    firstpos =`E${thirdpos.slice(1,thirdpos.length)}`
                    secondpos =`F${thirdpos.slice(1,thirdpos.length)}`
                    fourthpos =`H${thirdpos.slice(1,thirdpos.length)}`
                }
                else if(thirdpos.slice(0,1) == `H`){
                    firstpos =`F${thirdpos.slice(1,thirdpos.length)}`
                    secondpos =`G${thirdpos.slice(1,thirdpos.length)}`
                    fourthpos =`I${thirdpos.slice(1,thirdpos.length)}`
                }
                else if(thirdpos.slice(0,1) == `I`){
                    firstpos =`G${thirdpos.slice(1,thirdpos.length)}`
                    secondpos =`H${thirdpos.slice(1,thirdpos.length)}`
                    fourthpos =`J${thirdpos.slice(1,thirdpos.length)}`
                }
                
                

                if(document.getElementById(firstpos).attributes[4].value == `true` 
                || document.getElementById(secondpos).attributes[4].value == `true`
                || document.getElementById(thirdpos).attributes[4].value == `true`
                || document.getElementById(fourthpos).attributes[4].value == `true`
                   ){   
                       return console.log(false)
    
                   }
            }
        

    }
    if(data == `biggestShip`){

        if(bigShip.attributes[5].nodeValue == `horizontal`){
            //

            let firstpos;
            let secondpos;
            let thirdpos = ev.path[0].id;
            let fourthpos;
            let fifthpos;

            
            firstpos = `${thirdpos.slice(0,1)}${parseInt(thirdpos.slice(1,thirdpos.length))+2}`
            secondpos = `${thirdpos.slice(0,1)}${parseInt(thirdpos.slice(1,thirdpos.length))+1}`
            fourthpos = `${thirdpos.slice(0,1)}${parseInt(thirdpos.slice(1,thirdpos.length))-1}`
            fifthpos = `${thirdpos.slice(0,1)}${parseInt(thirdpos.slice(1,thirdpos.length))-2}`

            if(document.getElementById(firstpos).attributes[4].value == `true` 
            || document.getElementById(secondpos).attributes[4].value == `true`
            || document.getElementById(thirdpos).attributes[4].value == `true`
            || document.getElementById(fourthpos).attributes[4].value == `true`
            || document.getElementById(fifthpos).attributes[4].value == `true`
               ){   
                   return console.log(false)

               }
        }
        // vertical
        else{
            let firstpos;
            let secondpos;
            let thirdpos = ev.path[0].id;
            let fourthpos;
            let fifthpos;

            if(thirdpos.slice(0,1) == `C`){
                firstpos =`A${thirdpos.slice(1,thirdpos.length)}`
                secondpos =`B${thirdpos.slice(1,thirdpos.length)}`
                fourthpos =`D${thirdpos.slice(1,thirdpos.length)}`
                fifthpos =`E${thirdpos.slice(1,thirdpos.length)}`
            }
            else if(thirdpos.slice(0,1) == `D`){
                firstpos =`B${thirdpos.slice(1,thirdpos.length)}`
                secondpos =`C${thirdpos.slice(1,thirdpos.length)}`
                fourthpos =`E${thirdpos.slice(1,thirdpos.length)}`
                fifthpos =`F${thirdpos.slice(1,thirdpos.length)}`
            }
            else if(thirdpos.slice(0,1) == `E`){
                firstpos =`C${thirdpos.slice(1,thirdpos.length)}`
                secondpos =`D${thirdpos.slice(1,thirdpos.length)}`
                fourthpos =`F${thirdpos.slice(1,thirdpos.length)}`
                fifthpos =`G${thirdpos.slice(1,thirdpos.length)}`
            }
            else if(thirdpos.slice(0,1) == `F`){
                firstpos =`D${thirdpos.slice(1,thirdpos.length)}`
                secondpos =`E${thirdpos.slice(1,thirdpos.length)}`
                fourthpos =`G${thirdpos.slice(1,thirdpos.length)}`
                fifthpos =`H${thirdpos.slice(1,thirdpos.length)}`
            }
            else if(thirdpos.slice(0,1) == `G`){
                firstpos =`E${thirdpos.slice(1,thirdpos.length)}`
                secondpos =`F${thirdpos.slice(1,thirdpos.length)}`
                fourthpos =`H${thirdpos.slice(1,thirdpos.length)}`
                fifthpos =`I${thirdpos.slice(1,thirdpos.length)}`
            }
            else if(thirdpos.slice(0,1) == `H`){
                firstpos =`F${thirdpos.slice(1,thirdpos.length)}`
                secondpos =`G${thirdpos.slice(1,thirdpos.length)}`
                fourthpos =`I${thirdpos.slice(1,thirdpos.length)}`
                fifthpos =`J${thirdpos.slice(1,thirdpos.length)}`
            }
            
            

            if(document.getElementById(firstpos).attributes[4].value == `true` 
            || document.getElementById(secondpos).attributes[4].value == `true`
            || document.getElementById(thirdpos).attributes[4].value == `true`
            || document.getElementById(fourthpos).attributes[4].value == `true`
            || document.getElementById(fifthpos).attributes[4].value == `true`
               ){   
                   return console.log(false)

               }
        }

    }
    if(data == `threeShipOne`){
            if(threeShipOne.attributes[5].nodeValue == `horizontal`){
                //

                let firstpos;
                let secondpos = ev.path[0].id;
                let thirdpos ;

                
                firstpos = `${secondpos.slice(0,1)}${parseInt(secondpos.slice(1,secondpos.length))+1}`
                thirdpos = `${secondpos.slice(0,1)}${parseInt(secondpos.slice(1,secondpos.length))-1}`

                if(document.getElementById(firstpos).attributes[4].value == `true` 
                || document.getElementById(secondpos).attributes[4].value == `true`
                || document.getElementById(thirdpos).attributes[4].value == `true`
                   ){   
                       return console.log(false)
    
                   }
            }
            // vertical
            else{
                let firstpos;
                let secondpos = ev.path[0].id;
                let thirdpos ;

                if(secondpos.slice(0,1) == `B`){
                    firstpos =`A${secondpos.slice(1,secondpos.length)}`
                    thirdpos =`C${secondpos.slice(1,secondpos.length)}`
                }
                else if(secondpos.slice(0,1) == `C`){
                    firstpos =`B${secondpos.slice(1,secondpos.length)}`
                    thirdpos =`D${secondpos.slice(1,secondpos.length)}`
                }
                else if(secondpos.slice(0,1) == `D`){
                    firstpos =`C${secondpos.slice(1,secondpos.length)}`
                    thirdpos =`E${secondpos.slice(1,secondpos.length)}`
                }
                else if(secondpos.slice(0,1) == `E`){
                    firstpos =`D${secondpos.slice(1,secondpos.length)}`
                    thirdpos =`F${secondpos.slice(1,secondpos.length)}`
                }
                else if(secondpos.slice(0,1) == `F`){
                    firstpos =`E${secondpos.slice(1,secondpos.length)}`
                    thirdpos =`G${secondpos.slice(1,secondpos.length)}`
                }
                else if(secondpos.slice(0,1) == `G`){
                    firstpos =`F${secondpos.slice(1,secondpos.length)}`
                    thirdpos =`H${secondpos.slice(1,secondpos.length)}`
                }
                else if(secondpos.slice(0,1) == `H`){
                    firstpos =`G${secondpos.slice(1,secondpos.length)}`
                    thirdpos =`I${secondpos.slice(1,secondpos.length)}`
                }
                else if(secondpos.slice(0,1) == `I`){
                    firstpos =`H${secondpos.slice(1,secondpos.length)}`
                    thirdpos =`J${secondpos.slice(1,secondpos.length)}`
                }
                
                if(document.getElementById(firstpos).attributes[4].value == `true` 
                || document.getElementById(secondpos).attributes[4].value == `true`
                || document.getElementById(thirdpos).attributes[4].value == `true`
                   ){   
                       return console.log(false)
    
                   }
            }
        
    }
    if(data == `threeShipTwo`){

        if(threeShipTwo.attributes[5].nodeValue == `horizontal`){
            //

            let firstpos;
            let secondpos = ev.path[0].id;
            let thirdpos ;

            
            firstpos = `${secondpos.slice(0,1)}${parseInt(secondpos.slice(1,secondpos.length))+1}`
            thirdpos = `${secondpos.slice(0,1)}${parseInt(secondpos.slice(1,secondpos.length))-1}`

            if(document.getElementById(firstpos).attributes[4].value == `true` 
            || document.getElementById(secondpos).attributes[4].value == `true`
            || document.getElementById(thirdpos).attributes[4].value == `true`
               ){   
                   return console.log(false)

               }
        }
        // vertical
        else{
            let firstpos;
            let secondpos = ev.path[0].id;
            let thirdpos ;

            if(secondpos.slice(0,1) == `B`){
                firstpos =`A${secondpos.slice(1,secondpos.length)}`
                thirdpos =`C${secondpos.slice(1,secondpos.length)}`
            }
            else if(secondpos.slice(0,1) == `C`){
                firstpos =`B${secondpos.slice(1,secondpos.length)}`
                thirdpos =`D${secondpos.slice(1,secondpos.length)}`
            }
            else if(secondpos.slice(0,1) == `D`){
                firstpos =`C${secondpos.slice(1,secondpos.length)}`
                thirdpos =`E${secondpos.slice(1,secondpos.length)}`
            }
            else if(secondpos.slice(0,1) == `E`){
                firstpos =`D${secondpos.slice(1,secondpos.length)}`
                thirdpos =`F${secondpos.slice(1,secondpos.length)}`
            }
            else if(secondpos.slice(0,1) == `F`){
                firstpos =`E${secondpos.slice(1,secondpos.length)}`
                thirdpos =`G${secondpos.slice(1,secondpos.length)}`
            }
            else if(secondpos.slice(0,1) == `G`){
                firstpos =`F${secondpos.slice(1,secondpos.length)}`
                thirdpos =`H${secondpos.slice(1,secondpos.length)}`
            }
            else if(secondpos.slice(0,1) == `H`){
                firstpos =`G${secondpos.slice(1,secondpos.length)}`
                thirdpos =`I${secondpos.slice(1,secondpos.length)}`
            }
            else if(secondpos.slice(0,1) == `I`){
                firstpos =`H${secondpos.slice(1,secondpos.length)}`
                thirdpos =`J${secondpos.slice(1,secondpos.length)}`
            }
            
            if(document.getElementById(firstpos).attributes[4].value == `true` 
            || document.getElementById(secondpos).attributes[4].value == `true`
            || document.getElementById(thirdpos).attributes[4].value == `true`
               ){   
                   return console.log(false)

               }
        }


    }

// error handling for the drop on but not exactly on top

// model view controler architecture
// model is the abstract represntation of the game
// where shots are, ships, ect
// controler is the buttons that change the game -> updates model -> updated in the view
// MVC 

// State of the game can be represented in a low amount of variables
// state = object 

// 2nd datastructures
// 3rd most elegant representaion


/////////////////

    // if the user tries to drop the ship on an occupied div do nothing
    if(ev.path[0].id == `smallShip` || ev.path[0].id == `fourLongShip` || ev.path[0].id == `biggestShip` || ev.path[0].id == `threeShipOne` || ev.path[0].id == `threeShipTwo`) {
    
    }
    else{
        if(data == `smallShip`){
            // if horizontal
            if(smallShip.attributes[5].nodeValue == `horizontal`){
                console.log(smallShip.attributes[7].value)
                // target 
               
                if(ev.target.id[1]=='1' && ev.target.id[2] != 0){
                    
                }
                else if(ev.path[0].id != `smallShip`){{
                    // marking the past locations false
                    console.log(lastShipLocations)
                    for(ship in lastShipLocations)
                    {
                        if(lastShipLocations.length> 0)
                        {
                            if(lastShipLocations[ship]){
                        // get the current targeted divs like before, 
                        // if the new ones are present in the old one, don't set to false
                        console.log(document.getElementById(lastShipLocations[ship]))
                                document.getElementById(lastShipLocations[ship]).setAttribute(`shiphere`, false)
                                }   
                        }
             
                    }
                     // all of the past locations are being removed here
                    for(locations in lastShipLocations){lastShipLocations.pop()}

                    if(!getSmallShipSecondaryPositionDragWrapper(ev)){

                    }
                    else{
                    if(ev.target.id[1]=='1' && ev.target.id[2] != 0){
                
                        }
                        else{
                                ev.target.appendChild(document.getElementById(data));
                                smallShip.style.transform = "rotate(90deg) translateY(20px) translateX(-20px)";

                            }   
                        }
                    

                }
            
                }
                else {
                    console.log(`do nothing`)
                }
                
            }
            // if vertical
            else{

            // if the user drop it in the same place then don't do the below
            
            if(ev.target.id[0]=='J'){
                
            }

            else if(ev.path[1] != lastShipLocations[0]){
                // marking the past locations false
                for(ship in lastShipLocations)
                {
                    if(lastShipLocations.length> 0)
                    {
                        if(lastShipLocations[ship]){
                    // get the current targeted divs like before, 
                    // if the new ones are present in the old one, don't set to false
                            lastShipLocations[ship].setAttribute(`shiphere`, false)
                            }   
                    }
             
                }
    
            // all of the past locations are being removed here
             for(locations in lastShipLocations){lastShipLocations.pop()}

            if(!getSmallShipSecondaryPositionDragWrapper(ev)){

            }
            else{
            if(ev.target.id[0]=='J'){
        
                }
                else{
                        ev.target.appendChild(document.getElementById(data));
                    }   
                }}
            else{

                }
            }
        }

        if(data == `biggestShip`){

            if(bigShip.attributes[5].nodeValue == `horizontal`){
                
                // this if is for targetting the same location to remove the false flag bug
                if(ev.path[1] != lastShipLocations[0]){
                    for(ship in lastShipLocations){
                        if(lastShipLocations.length> 0){
                        
        
                     if(lastShipLocations[ship]){
                     // get the current targeted divs like before, if the new ones are present in the old one, don't set to false
                      lastShipLocations[ship].setAttribute(`shiphere`, false)
                      }   
                     }
                     }
        
                    if(!getbigShipSecondaryPositionDragWrapper(ev)){}
                    else{
                    
                    if(parseInt(ev.target.id.slice(1,ev.target.id.length))<3){ 
                        
                }
                    else{
                        
                        ev.target.appendChild(document.getElementById(data));
                    }}}
                    else{
                        
                    }
            }
            // Vertical 
            else{
            // marking the past locations false
            if(ev.target.id.slice(0,1)==`J` || ev.target.id.slice(0,1)==`I` || ev.target.id.slice(0,1)==`A`|| ev.target.id.slice(0,1)==`B`){
                return false
            }
            if(ev.path[1] != lastShipLocations[0]){
            for(ship in lastShipLocations){
                if(lastShipLocations.length> 0){
                

             if(lastShipLocations[ship]){
             // get the current targeted divs like before, if the new ones are present in the old one, don't set to false
              lastShipLocations[ship].setAttribute(`shiphere`, false)
              }   
             }
             }

            if(!getbigShipSecondaryPositionDragWrapper(ev)){}
            else{
            
            
            if(ev.target.id[0]=='J' || ev.target.id[0]=='I' || ev.target.id[0]=='A' || ev.target.id[0]=='B'){ 
        }
            else{
                
                ev.target.appendChild(document.getElementById(data));
                bigShip.style.transform = "translateY(-80px)";
            }}}
            else{
                
            }
        }
    }

       if(data == `fourLongShip`){

        if(fourLongShip.attributes[5].nodeValue == `horizontal`){
            // to get rid of the horizotal oob isse
            if(ev.target.id.slice(1,ev.target.id.length)>8){
                console.log(`OOB2`)
                return false
            }
            
            // this if is for targetting the same location to remove the false flag bug
            if(ev.path[1] != lastShipLocations[0]){
                for(ship in lastShipLocations){
                    if(lastShipLocations.length> 0){
                    
    
                 if(lastShipLocations[ship]){
                 // get the current targeted divs like before, if the new ones are present in the old one, don't set to false
                  lastShipLocations[ship].setAttribute(`shiphere`, false)
                  }   
                 }
                 }
    
                if(!getfourLongShipSecondaryPositionDragWrapper(ev)){}
                else{
                
                if(parseInt(ev.target.id.slice(1,ev.target.id.length))<2){ 
                    
            }
                else{
                    
                    ev.target.appendChild(document.getElementById(data));
                }}}
                else{
                    
                }
        }
        // Vertical 
        else{
        // marking the past locations false
        if(ev.target.id.slice(0,1)==`J` || ev.target.id.slice(0,1)==`A`|| ev.target.id.slice(0,1)==`B`){
            console.log(`OOB`)
            return false
        }
        if(ev.path[1] != lastShipLocations[0]){
        for(ship in lastShipLocations){
            if(lastShipLocations.length> 0){
            

         if(lastShipLocations[ship]){
         // get the current targeted divs like before, if the new ones are present in the old one, don't set to false
          lastShipLocations[ship].setAttribute(`shiphere`, false)
          }   
         }
         }

        if(!getfourLongShipSecondaryPositionDragWrapper(ev)){}
        else{
        
        
        if(ev.target.id[0]=='J' || ev.target.id[0]=='A' || ev.target.id[0]=='B'){ 
    }
        else{
            
            ev.target.appendChild(document.getElementById(data));
            fourLongShip.style.transform = "translateY(-80px)";
        }}}
        else{
            
        }
    }
}

      if(data == `threeShipOne` ){

    if(threeShipOne.attributes[5].nodeValue == `horizontal`){
        // to get rid of the horizotal oob isse
        if(ev.target.id.slice(1,ev.target.id.length)>9){
            console.log(`OOB2`)
            return false
        }
        
        // this if is for targetting the same location to remove the false flag bug
        if(ev.path[1] != lastShipLocations[0]){
            for(ship in lastShipLocations){
                if(lastShipLocations.length> 0){
                

             if(lastShipLocations[ship]){
             // get the current targeted divs like before, if the new ones are present in the old one, don't set to false
              lastShipLocations[ship].setAttribute(`shiphere`, false)
              }   
             }
             }

            if(!getThreeLongShipSecondaryPositionDragWrapper(ev)){}
            else{
            
            if(parseInt(ev.target.id.slice(1,ev.target.id.length))<2){ 
                
        }
            else{
                
                ev.target.appendChild(document.getElementById(data));
            }}}
            else{
                
            }
    }
    // Vertical 
    else{
    // marking the past locations false
    if(ev.target.id.slice(0,1)==`J` || ev.target.id.slice(0,1)==`A`){
        console.log(`OOB`)
        return false
    }
    if(ev.path[1] != lastShipLocations[0]){
    for(ship in lastShipLocations){
        if(lastShipLocations.length> 0){
        

     if(lastShipLocations[ship]){
     // get the current targeted divs like before, if the new ones are present in the old one, don't set to false
      lastShipLocations[ship].setAttribute(`shiphere`, false)
      }   
     }
     }

    if(!getThreeLongShipSecondaryPositionDragWrapper(ev)){}
    else{
    
    
    if(ev.target.id[0]=='J' || ev.target.id[0]=='A' ){ 
}
    else{
        
        ev.target.appendChild(document.getElementById(data));
        threeShipOne.style.transform = "translateY(-40px)";
    
    }}}
    else{
        
    }
}
}
    if(data == `threeShipTwo`){

        if(threeShipTwo.attributes[5].nodeValue == `horizontal`){
            // to get rid of the horizotal oob isse
            if(ev.target.id.slice(1,ev.target.id.length)>9){
                console.log(`OOB2`)
                return false
            }
            
            // this if is for targetting the same location to remove the false flag bug
            if(ev.path[1] != lastShipLocations[0]){
                for(ship in lastShipLocations){
                    if(lastShipLocations.length> 0){
                    
    
                 if(lastShipLocations[ship]){
                 // get the current targeted divs like before, if the new ones are present in the old one, don't set to false
                  lastShipLocations[ship].setAttribute(`shiphere`, false)
                  }   
                 }
                 }
    
                if(!getThreeLongShipTwoSecondaryPositionDragWrapper(ev)){}
                else{
                
                if(parseInt(ev.target.id.slice(1,ev.target.id.length))<2){ 
                    
            }
                else{
                    
                    ev.target.appendChild(document.getElementById(data));
                }}}
                else{
                    
                }
        }
        // Vertical 
        else{
        // marking the past locations false
        if(ev.target.id.slice(0,1)==`J` || ev.target.id.slice(0,1)==`A`){
            console.log(`OOB`)
            return false
        }
        if(ev.path[1] != lastShipLocations[0]){
        for(ship in lastShipLocations){
            if(lastShipLocations.length> 0){
            
    
         if(lastShipLocations[ship]){
         // get the current targeted divs like before, if the new ones are present in the old one, don't set to false
          lastShipLocations[ship].setAttribute(`shiphere`, false)
          }   
         }
         }
    
        if(!getThreeLongShipTwoSecondaryPositionDragWrapper(ev)){}
        else{
        
        
        if(ev.target.id[0]=='J' || ev.target.id[0]=='A' ){ 
    }
        else{
            
            ev.target.appendChild(document.getElementById(data));

            threeShipTwo.style.transform = "translateY(-40px)";
        }}}
        else{
            
        }
    }




    }
    }
    
    if(document.getElementById(`shipContainer`).childElementCount == 0){
        document.getElementById('startbutton').style.visibility = 'visible';
    }

  }

  function getThreeLongShipTwoSecondaryPositionDragWrapper(ev){

    
    if(threeShipTwo.attributes[5].nodeValue == `vertical`){
        let firstPosition;
        let secondaryPosition = ev.target.id;
        let thirdPosition 

        if(secondaryPosition[0]=='B'){
            firstPosition=`A`+secondaryPosition.slice(1,secondaryPosition.length);
            thirdPosition=`C`+secondaryPosition.slice(1,secondaryPosition.length);
         }
         else if(secondaryPosition[0]=='C'){
            firstPosition=`B`+secondaryPosition.slice(1,secondaryPosition.length);
            thirdPosition=`D`+secondaryPosition.slice(1,secondaryPosition.length);
         }
            else if(secondaryPosition[0]=='D'){
                firstPosition=`C`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`E`+secondaryPosition.slice(1,secondaryPosition.length);
             }
            else if(secondaryPosition[0]=='E'){
                firstPosition=`D`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`F`+secondaryPosition.slice(1,secondaryPosition.length);
             }
            else if(secondaryPosition[0]=='F'){
                firstPosition=`E`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`G`+secondaryPosition.slice(1,secondaryPosition.length);
             }
            else if(secondaryPosition[0]=='G'){
                firstPosition=`F`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`H`+secondaryPosition.slice(1,secondaryPosition.length);
             }
                else if(secondaryPosition[0]=='H'){
                    firstPosition=`G`+secondaryPosition.slice(1,secondaryPosition.length);
                    thirdPosition=`I`+secondaryPosition.slice(1,secondaryPosition.length);
                 }
                 if(secondaryPosition[0]=='I'){
                    firstPosition=`H`+secondaryPosition.slice(1,secondaryPosition.length);
                    thirdPosition=`J`+secondaryPosition.slice(1,secondaryPosition.length);
                 }
        

                // HERE IS WHERE WE TEST IF WE CAN PLACE THE SHIP
               
                if(document.getElementById(secondaryPosition).attributes[4].value == `true` 
                || document.getElementById(firstPosition).attributes[4].value == `true`
                || document.getElementById(thirdPosition).attributes[4].value == `true`
                   )
                    {
                        return false
                    }
                else if(document.getElementById(secondaryPosition).attributes[4].value == `false` 
                && document.getElementById(firstPosition).attributes[4].value == `false`
                && document.getElementById(thirdPosition).attributes[4].value == `false`
                     ){

                ev.target.setAttribute(`shiphere`, true);
                document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
                document.getElementById(firstPosition).setAttribute(`shiphere`, true);
                document.getElementById(thirdPosition).setAttribute(`shiphere`, true);
                }
                return true
    }
    else // horizontal
    {
        
        
        //erroring when draggin in horizontal to 9 or 10
        let firstPosition ;
        let secondaryPosition = ev.target.id;
        let thirdPosition 


        if(secondaryPosition[0]=='A'){
            firstPosition=`A${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
            thirdPosition=`A${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
         }
            else if(secondaryPosition[0]=='B'){
                firstPosition=`B${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                thirdPosition=`B${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
             }
            else if(secondaryPosition[0]=='C'){
                firstPosition=`C${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                thirdPosition=`C${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
             }
            else if(secondaryPosition[0]=='D'){
                firstPosition=`D${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                thirdPosition=`D${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
             }
            else if(secondaryPosition[0]=='E'){
                firstPosition=`E${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                thirdPosition=`E${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
             }
            else if(secondaryPosition[0]=='F'){
                firstPosition=`F${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                thirdPosition=`F${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
             }
                else if(secondaryPosition[0]=='G'){
                    firstPosition=`G${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                    thirdPosition=`G${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
                 }
                    else if(secondaryPosition[0]=='H'){
                        firstPosition=`H${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                        thirdPosition=`H${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
                     }
                        else if(secondaryPosition[0]=='I'){
                            firstPosition=`I${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                            thirdPosition=`I${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
                         }
                            else if(secondaryPosition[0]=='J'){
                                firstPosition=`J${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                                thirdPosition=`J${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
                             }
console.log(firstPosition)
console.log(secondaryPosition)
console.log(thirdPosition)
       

                // HERE IS WHERE WE TEST IF WE CAN PLACE THE SHIP
                if(document.getElementById(secondaryPosition).attributes[4].value == `true` 
                || document.getElementById(firstPosition).attributes[4].value == `true`
                || document.getElementById(thirdPosition).attributes[4].value == `true`
                    )
                    {
                        return false
                    }
                else if(document.getElementById(secondaryPosition).attributes[4].value == `false` 
                && document.getElementById(firstPosition).attributes[4].value == `false`
                && document.getElementById(thirdPosition).attributes[4].value == `false`
                     ){

                ev.target.setAttribute(`shiphere`, true);
                document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
                document.getElementById(firstPosition).setAttribute(`shiphere`, true);
                document.getElementById(thirdPosition).setAttribute(`shiphere`, true);
                }
                return true

    }





  }

  function getThreeLongShipSecondaryPositionDragWrapper (ev) {
    
    if(threeShipOne.attributes[5].nodeValue == `vertical`){
        let firstPosition;
        let secondaryPosition = ev.target.id;
        let thirdPosition 

        if(secondaryPosition[0]=='B'){
            firstPosition=`A`+secondaryPosition.slice(1,secondaryPosition.length);
            thirdPosition=`C`+secondaryPosition.slice(1,secondaryPosition.length);
         }
         else if(secondaryPosition[0]=='C'){
            firstPosition=`B`+secondaryPosition.slice(1,secondaryPosition.length);
            thirdPosition=`D`+secondaryPosition.slice(1,secondaryPosition.length);
         }
            else if(secondaryPosition[0]=='D'){
                firstPosition=`C`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`E`+secondaryPosition.slice(1,secondaryPosition.length);
             }
            else if(secondaryPosition[0]=='E'){
                firstPosition=`D`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`F`+secondaryPosition.slice(1,secondaryPosition.length);
             }
            else if(secondaryPosition[0]=='F'){
                firstPosition=`E`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`G`+secondaryPosition.slice(1,secondaryPosition.length);
             }
            else if(secondaryPosition[0]=='G'){
                firstPosition=`F`+secondaryPosition.slice(1,secondaryPosition.length);
                thirdPosition=`H`+secondaryPosition.slice(1,secondaryPosition.length);
             }
                else if(secondaryPosition[0]=='H'){
                    firstPosition=`G`+secondaryPosition.slice(1,secondaryPosition.length);
                    thirdPosition=`I`+secondaryPosition.slice(1,secondaryPosition.length);
                 }
                 if(secondaryPosition[0]=='I'){
                    firstPosition=`H`+secondaryPosition.slice(1,secondaryPosition.length);
                    thirdPosition=`J`+secondaryPosition.slice(1,secondaryPosition.length);
                 }
        

                // HERE IS WHERE WE TEST IF WE CAN PLACE THE SHIP
               
                if(document.getElementById(secondaryPosition).attributes[4].value == `true` 
                || document.getElementById(firstPosition).attributes[4].value == `true`
                || document.getElementById(thirdPosition).attributes[4].value == `true`
                   )
                    {
                        return false
                    }
                else if(document.getElementById(secondaryPosition).attributes[4].value == `false` 
                && document.getElementById(firstPosition).attributes[4].value == `false`
                && document.getElementById(thirdPosition).attributes[4].value == `false`
                     ){

                ev.target.setAttribute(`shiphere`, true);
                document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
                document.getElementById(firstPosition).setAttribute(`shiphere`, true);
                document.getElementById(thirdPosition).setAttribute(`shiphere`, true);
                }
                return true
    }
    else // horizontal
    {
        
        
        //erroring when draggin in horizontal to 9 or 10
        let firstPosition ;
        let secondaryPosition = ev.target.id;
        let thirdPosition 


        if(secondaryPosition[0]=='A'){
            firstPosition=`A${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
            thirdPosition=`A${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
         }
            else if(secondaryPosition[0]=='B'){
                firstPosition=`B${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                thirdPosition=`B${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
             }
            else if(secondaryPosition[0]=='C'){
                firstPosition=`C${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                thirdPosition=`C${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
             }
            else if(secondaryPosition[0]=='D'){
                firstPosition=`D${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                thirdPosition=`D${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
             }
            else if(secondaryPosition[0]=='E'){
                firstPosition=`E${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                thirdPosition=`E${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
             }
            else if(secondaryPosition[0]=='F'){
                firstPosition=`F${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                thirdPosition=`F${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
             }
                else if(secondaryPosition[0]=='G'){
                    firstPosition=`G${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                    thirdPosition=`G${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
                 }
                    else if(secondaryPosition[0]=='H'){
                        firstPosition=`H${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                        thirdPosition=`H${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
                     }
                        else if(secondaryPosition[0]=='I'){
                            firstPosition=`I${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                            thirdPosition=`I${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
                         }
                            else if(secondaryPosition[0]=='J'){
                                firstPosition=`J${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                                thirdPosition=`J${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
                             }
console.log(firstPosition)
console.log(secondaryPosition)
console.log(thirdPosition)
       

                // HERE IS WHERE WE TEST IF WE CAN PLACE THE SHIP
                if(document.getElementById(secondaryPosition).attributes[4].value == `true` 
                || document.getElementById(firstPosition).attributes[4].value == `true`
                || document.getElementById(thirdPosition).attributes[4].value == `true`
                    )
                    {
                        return false
                    }
                else if(document.getElementById(secondaryPosition).attributes[4].value == `false` 
                && document.getElementById(firstPosition).attributes[4].value == `false`
                && document.getElementById(thirdPosition).attributes[4].value == `false`
                     ){

                ev.target.setAttribute(`shiphere`, true);
                document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
                document.getElementById(firstPosition).setAttribute(`shiphere`, true);
                document.getElementById(thirdPosition).setAttribute(`shiphere`, true);
                }
                return true

    }

  }

  function getfourLongShipSecondaryPositionDragWrapper (ev){
    
    if(fourLongShip.attributes[5].nodeValue == `vertical`){
        let firstPosition 
        let secondaryPosition;
        let thirdPosition = ev.target.id;
        let fourthPosition;

        if(thirdPosition[0]=='C'){
            firstPosition=`A`+thirdPosition.slice(1,thirdPosition.length);
            secondaryPosition=`B`+thirdPosition.slice(1,thirdPosition.length)

            fourthPosition=`D`+thirdPosition.slice(1,thirdPosition.length);
         }
            else if(thirdPosition[0]=='D'){
            firstPosition=`B`+thirdPosition.slice(1,thirdPosition.length);
            secondaryPosition=`C`+thirdPosition.slice(1,thirdPosition.length)
            
            fourthPosition=`E`+thirdPosition.slice(1,thirdPosition.length);}
            else if(thirdPosition[0]=='E'){
                firstPosition=`C`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`D`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`F`+thirdPosition.slice(1,thirdPosition.length);}
            else if(thirdPosition[0]=='F'){
                firstPosition=`D`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`E`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`G`+thirdPosition.slice(1,thirdPosition.length);}
            else if(thirdPosition[0]=='G'){
                firstPosition=`E`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`F`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`H`+thirdPosition.slice(1,thirdPosition.length);}
            else if(thirdPosition[0]=='H'){
                firstPosition=`F`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`G`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`I`+thirdPosition.slice(1,thirdPosition.length);}
                else if(thirdPosition[0]=='I'){
                    firstPosition=`G`+thirdPosition.slice(1,thirdPosition.length);
                    secondaryPosition=`H`+thirdPosition.slice(1,thirdPosition.length)
                    
                    fourthPosition=`J`+thirdPosition.slice(1,thirdPosition.length);}
        
        
                //console.log(document.getElementById(secondaryPosition).attributes[4].value)
                //console.log(document.getElementById(thirdPosition).attributes[4].value)
                //console.log(document.getElementById(fourthPosition).attributes[4].value)
                //console.log(document.getElementById(fifthPosition).attributes[4].value)
                // HERE IS WHERE WE TEST IF WE CAN PLACE THE SHIP
               
                if(document.getElementById(secondaryPosition).attributes[4].value == `true` 
                || document.getElementById(firstPosition).attributes[4].value == `true`
                || document.getElementById(fourthPosition).attributes[4].value == `true`
                   )
                    {
                        return false
                    }
                else if(document.getElementById(secondaryPosition).attributes[4].value == `false` 
                && document.getElementById(firstPosition).attributes[4].value == `false`
                && document.getElementById(fourthPosition).attributes[4].value == `false`
                     ){

                ev.target.setAttribute(`shiphere`, true);
                document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
                document.getElementById(firstPosition).setAttribute(`shiphere`, true);
                document.getElementById(fourthPosition).setAttribute(`shiphere`, true);
                }
                return true
    }
    else // horizontal
    {
       
        
        //erroring when draggin in horizontal to 9 or 10
        let firstPosition ;
        let secondaryPosition;
        let thirdPosition = ev.target.id;
        let fourthPosition;


        if(thirdPosition[0]=='A'){
            secondaryPosition=`A${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
            firstPosition=`A${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
            fourthPosition=`A${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
         }
            else if(thirdPosition[0]=='B'){
                secondaryPosition=`B${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                firstPosition=`B${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                fourthPosition=`B${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
            else if(thirdPosition[0]=='C'){
                secondaryPosition=`C${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                firstPosition=`C${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                fourthPosition=`C${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
            else if(thirdPosition[0]=='D'){
                secondaryPosition=`D${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                firstPosition=`D${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                fourthPosition=`D${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
            else if(thirdPosition[0]=='E'){
                secondaryPosition=`E${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                firstPosition=`E${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                fourthPosition=`E${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
            else if(thirdPosition[0]=='F'){
                secondaryPosition=`F${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                firstPosition=`F${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                fourthPosition=`F${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
                else if(thirdPosition[0]=='G'){
                    secondaryPosition=`G${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                    firstPosition=`G${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                    fourthPosition=`G${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
                    else if(thirdPosition[0]=='H'){
                        secondaryPosition=`H${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                        firstPosition=`H${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                        fourthPosition=`H${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
                        else if(thirdPosition[0]=='I'){
                            secondaryPosition=`I${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                            firstPosition=`I${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                            fourthPosition=`I${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}
                            else if(thirdPosition[0]=='J'){
                                secondaryPosition=`J${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                                firstPosition=`J${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                                fourthPosition=`J${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`}

       

                // HERE IS WHERE WE TEST IF WE CAN PLACE THE SHIP
                if(document.getElementById(secondaryPosition).attributes[4].value == `true` 
                || document.getElementById(firstPosition).attributes[4].value == `true`
                || document.getElementById(fourthPosition).attributes[4].value == `true`
                    )
                    {
                        return false
                    }
                else if(document.getElementById(secondaryPosition).attributes[4].value == `false` 
                && document.getElementById(firstPosition).attributes[4].value == `false`
                && document.getElementById(fourthPosition).attributes[4].value == `false`
                     ){

                ev.target.setAttribute(`shiphere`, true);
                document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
                document.getElementById(firstPosition).setAttribute(`shiphere`, true);
                document.getElementById(fourthPosition).setAttribute(`shiphere`, true);
                }
                return true

    }
    
    
}

function getbigShipSecondaryPositionDragWrapper (ev){
    
    if(bigShip.attributes[5].nodeValue == `vertical`){
        let firstPosition 
        let secondaryPosition;
        let thirdPosition = ev.target.id;
        let fourthPosition;
        let fifthPosition;

        if(thirdPosition[0]=='C'){
            firstPosition=`A`+thirdPosition.slice(1,thirdPosition.length);
            secondaryPosition=`B`+thirdPosition.slice(1,thirdPosition.length)

            fourthPosition=`D`+thirdPosition.slice(1,thirdPosition.length);
            fifthPosition=`E`+thirdPosition.slice(1,thirdPosition.length);
         }
            else if(thirdPosition[0]=='D'){
            firstPosition=`B`+thirdPosition.slice(1,thirdPosition.length);
            secondaryPosition=`C`+thirdPosition.slice(1,thirdPosition.length)
            
            fourthPosition=`E`+thirdPosition.slice(1,thirdPosition.length);
            fifthPosition=`F`+thirdPosition.slice(1,thirdPosition.length);}
            else if(thirdPosition[0]=='E'){
                firstPosition=`C`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`D`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`F`+thirdPosition.slice(1,thirdPosition.length);
                fifthPosition=`G`+thirdPosition.slice(1,thirdPosition.length);}
            else if(thirdPosition[0]=='F'){
                firstPosition=`D`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`E`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`G`+thirdPosition.slice(1,thirdPosition.length);
                fifthPosition=`H`+thirdPosition.slice(1,thirdPosition.length);}
            else if(thirdPosition[0]=='G'){
                firstPosition=`E`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`F`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`H`+thirdPosition.slice(1,thirdPosition.length);
                fifthPosition=`I`+thirdPosition.slice(1,thirdPosition.length);}
            else if(thirdPosition[0]=='H'){
                firstPosition=`F`+thirdPosition.slice(1,thirdPosition.length);
                secondaryPosition=`G`+thirdPosition.slice(1,thirdPosition.length)
                
                fourthPosition=`I`+thirdPosition.slice(1,thirdPosition.length);
                fifthPosition=`J`+thirdPosition.slice(1,thirdPosition.length);}

                //console.log(document.getElementById(secondaryPosition).attributes[4].value)
                //console.log(document.getElementById(thirdPosition).attributes[4].value)
                //console.log(document.getElementById(fourthPosition).attributes[4].value)
                //console.log(document.getElementById(fifthPosition).attributes[4].value)
                // HERE IS WHERE WE TEST IF WE CAN PLACE THE SHIP
                if(document.getElementById(secondaryPosition).attributes[4].value == `true` 
                || document.getElementById(firstPosition).attributes[4].value == `true`
                || document.getElementById(fourthPosition).attributes[4].value == `true`
                || document.getElementById(fifthPosition).attributes[4].value == `true`
                    )
                    {
                        return false
                    }
                else if(document.getElementById(secondaryPosition).attributes[4].value == `false` 
                && document.getElementById(firstPosition).attributes[4].value == `false`
                && document.getElementById(fourthPosition).attributes[4].value == `false`
                && document.getElementById(fifthPosition).attributes[4].value == `false`
                     ){

                ev.target.setAttribute(`shiphere`, true);
                document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
                document.getElementById(firstPosition).setAttribute(`shiphere`, true);
                document.getElementById(fourthPosition).setAttribute(`shiphere`, true);
                document.getElementById(fifthPosition).setAttribute(`shiphere`, true);
                }
                return true
    }
    else // horizontal
    {
        let firstPosition ;
        let secondaryPosition;
        let thirdPosition = ev.target.id;
        let fourthPosition;
        let fifthPosition;


        if(thirdPosition[0]=='A'){
            secondaryPosition=`A${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
            firstPosition=`A${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
            fourthPosition=`A${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
            fifthPosition=`A${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`
         }
            else if(thirdPosition[0]=='B'){
                secondaryPosition=`B${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                firstPosition=`B${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                fourthPosition=`B${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                fifthPosition=`B${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
            else if(thirdPosition[0]=='C'){
                secondaryPosition=`C${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                firstPosition=`C${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                fourthPosition=`C${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                fifthPosition=`C${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
            else if(thirdPosition[0]=='D'){
                secondaryPosition=`D${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                firstPosition=`D${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                fourthPosition=`D${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                fifthPosition=`D${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
            else if(thirdPosition[0]=='E'){
                secondaryPosition=`E${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                firstPosition=`E${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                fourthPosition=`E${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                fifthPosition=`E${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
            else if(thirdPosition[0]=='F'){
                secondaryPosition=`F${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                firstPosition=`F${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                fourthPosition=`F${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                fifthPosition=`F${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
                else if(thirdPosition[0]=='G'){
                    secondaryPosition=`G${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                    firstPosition=`G${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                    fourthPosition=`G${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                    fifthPosition=`G${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
                    else if(thirdPosition[0]=='H'){
                        secondaryPosition=`H${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                        firstPosition=`H${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                        fourthPosition=`H${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                        fifthPosition=`H${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
                        else if(thirdPosition[0]=='I'){
                            secondaryPosition=`I${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                            firstPosition=`I${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                            fourthPosition=`I${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                            fifthPosition=`I${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}
                            else if(thirdPosition[0]=='J'){
                                secondaryPosition=`J${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                                firstPosition=`J${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                                fourthPosition=`J${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                                fifthPosition=`J${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`}

       

                // HERE IS WHERE WE TEST IF WE CAN PLACE THE SHIP
                if(document.getElementById(secondaryPosition).attributes[4].value == `true` 
                || document.getElementById(firstPosition).attributes[4].value == `true`
                || document.getElementById(fourthPosition).attributes[4].value == `true`
                || document.getElementById(fifthPosition).attributes[4].value == `true`
                    )
                    {
                        return false
                    }
                else if(document.getElementById(secondaryPosition).attributes[4].value == `false` 
                && document.getElementById(firstPosition).attributes[4].value == `false`
                && document.getElementById(fourthPosition).attributes[4].value == `false`
                && document.getElementById(fifthPosition).attributes[4].value == `false`
                     ){

                ev.target.setAttribute(`shiphere`, true);
                document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
                document.getElementById(firstPosition).setAttribute(`shiphere`, true);
                document.getElementById(fourthPosition).setAttribute(`shiphere`, true);
                document.getElementById(fifthPosition).setAttribute(`shiphere`, true);
                }
                return true

    }
    
    
}

function getSmallShipSecondaryPositionDragWrapper(ev){
    
        let firstPosition = ev.target.id
        if(smallShip.attributes[5].nodeValue == `vertical`){
            
            let secondaryPosition = returnSecondaryPostitionForVerticalSmallShip(ev)
            console.log(firstPosition)
            console.log(secondaryPosition)
            if(document.getElementById(secondaryPosition).attributes[4].value == `true`){
                return false;
            }
            else{
            if(secondaryPosition){
            ev.target.setAttribute(`shiphere`, true);
            document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
            //lastSshipLocations.push(document.getElementById(secondaryPosition))
            }
            return true
        }
        }
        else if (smallShip.attributes[5].nodeValue == `horizontal`){
            
            let secondaryPosition = returnSecondaryPostitionForHorizontalSmallShip(ev)
            console.log(secondaryPosition)
            console.log(firstPosition)
            //console.log(document.getElementById(secondaryPosition).attributes[4].value)
            if(document.getElementById(secondaryPosition).attributes[4].value == `true`){
                return false;
            }
            else{
                if(secondaryPosition){
                ev.target.setAttribute(`shiphere`, true);
                document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
                }
            return true
        }


        }
            
}

function returnSecondaryPostitionForHorizontalSmallShip(ev){
    let firstPosition = ev.target.id;
    let secondaryPosition ='';
    if(firstPosition[0]=='A'){secondaryPosition=`A${firstPosition.slice(1,firstPosition.length)-1}`}
            else if(firstPosition[0]=='B'){secondaryPosition=`B${firstPosition.slice(1,firstPosition.length)-1}`}
            else if(firstPosition[0]=='C'){secondaryPosition=`C${firstPosition.slice(1,firstPosition.length)-1}`}
            else if(firstPosition[0]=='D'){secondaryPosition=`D${firstPosition.slice(1,firstPosition.length)-1}`}
            else if(firstPosition[0]=='E'){secondaryPosition=`E${firstPosition.slice(1,firstPosition.length)-1}`}
            else if(firstPosition[0]=='F'){secondaryPosition=`F${firstPosition.slice(1,firstPosition.length)-1}`}
            else if(firstPosition[0]=='G'){secondaryPosition=`G${firstPosition.slice(1,firstPosition.length)-1}`}
            else if(firstPosition[0]=='H'){secondaryPosition=`H${firstPosition.slice(1,firstPosition.length)-1}`}
            else if(firstPosition[0]=='I'){secondaryPosition=`I${firstPosition.slice(1,firstPosition.length)-1}`}
            else if(firstPosition[0]=='J'){secondaryPosition=`J${firstPosition.slice(1,firstPosition.length)-1}`}
            return `${secondaryPosition}`;
}

function returnSecondaryPostitionForVerticalSmallShip(ev){
    let firstPosition = ev.target.id;
    let secondaryPosition ='';
    if(firstPosition[0]=='A'){secondaryPosition=`B`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='B'){secondaryPosition=`C`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='C'){secondaryPosition=`D`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='D'){secondaryPosition=`E`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='E'){secondaryPosition=`F`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='F'){secondaryPosition=`G`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='G'){secondaryPosition=`H`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='H'){secondaryPosition=`I`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='I'){secondaryPosition=`J`+firstPosition.slice(1,firstPosition.length)}
            return `${secondaryPosition}`;
}

function rotatethreeShipOne (){

    if(threeShipOne.attributes[5].nodeValue == `vertical`){

    let firstPosition;

    if(threeShipOne.parentElement.id[0] == `B`){
        firstPosition = `A${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))}`
    }
    else if(threeShipOne.parentElement.id[0] == `C`){
        firstPosition = `B${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))}`
    }
    else if(threeShipOne.parentElement.id[0] == `D`){
        firstPosition = `C${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))}`
    }
    else if(threeShipOne.parentElement.id[0] == `E`){
        firstPosition = `D${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))}`
    }
    else if(threeShipOne.parentElement.id[0] == `F`){
        firstPosition = `E${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))}`
    }
    else if(threeShipOne.parentElement.id[0] == `G`){
        firstPosition = `F${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))}`
    }
    else if(threeShipOne.parentElement.id[0] == `H`){
        firstPosition = `G${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))}`
    }
    else if(threeShipOne.parentElement.id[0] == `I`){
        firstPosition = `H${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))}`
    }

    let secondaryPosition ='';
    let rotatedPosition='';
    // handling the map falses 

    if(parseInt(firstPosition.slice(1,firstPosition.length)) > 9 || parseInt(firstPosition.slice(1,firstPosition.length)) < 2){
        console.log(`Out of bounds rotation`)
        return false
    }
    

    if(firstPosition.slice(0,1)==`A`){
        secondaryPosition=`B${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`C${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`B`){
        secondaryPosition=`C${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`D${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`C`){
        secondaryPosition=`D${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`E${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`D`){
        secondaryPosition=`E${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`F${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`E`){
        secondaryPosition=`F${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`G${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`F`){
        secondaryPosition=`G${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`H${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`G`){
        secondaryPosition=`H${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`I${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`H`){
        secondaryPosition=`I${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`J${firstPosition.slice(1,firstPosition.length)}`
    }

    document.getElementById(`${firstPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${secondaryPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${thirdPosition}`).setAttribute(`shiphere`, false);

    if(firstPosition[0]=='A'){
        rotatedPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
        secondaryPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length))}`
        thirdPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
     }
        else if(firstPosition[0]=='B'){
            rotatedPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            secondaryPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))}`
            thirdPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='C'){
            rotatedPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            secondaryPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))}`
            thirdPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='D'){
            rotatedPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            secondaryPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))}`
            thirdPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='E'){
            rotatedPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            secondaryPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))}`
            thirdPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='F'){
            rotatedPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            secondaryPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))}`
            thirdPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
         else if(firstPosition[0]=='G'){
            rotatedPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            secondaryPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))}`
            thirdPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
         else if(firstPosition[0]=='H'){
            rotatedPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            secondaryPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))}`
            thirdPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
         console.log(rotatedPosition)
         console.log(secondaryPosition)
         console.log(thirdPosition)


         console.log(document.getElementById(firstPosition).attributes[4].value)

         if(document.getElementById(rotatedPosition).attributes[4].value == `true` 
         || document.getElementById(secondaryPosition).attributes[4].value == `true` 
         || document.getElementById(thirdPosition).attributes[4].value == `true`
             )
             {
                 console.log(`something in the way `)


                 if(firstPosition.slice(0,1)==`A`){
                    secondaryPosition=`B${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`C${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`B`){
                    secondaryPosition=`C${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`D${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`C`){
                    secondaryPosition=`D${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`E${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`D`){
                    secondaryPosition=`E${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`F${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`E`){
                    secondaryPosition=`F${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`G${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`F`){
                    secondaryPosition=`G${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`H${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`G`){
                    secondaryPosition=`H${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`I${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`H`){
                    secondaryPosition=`I${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`J${firstPosition.slice(1,firstPosition.length)}`
                }
                document.getElementById(`${firstPosition}`).setAttribute(`shiphere`, true);
                document.getElementById(`${secondaryPosition}`).setAttribute(`shiphere`, true);
                document.getElementById(`${thirdPosition}`).setAttribute(`shiphere`, true);

                 return false
             }
         else if(document.getElementById(rotatedPosition).attributes[4].value == `false` 
         && document.getElementById(secondaryPosition).attributes[4].value == `false` 
         && document.getElementById(thirdPosition).attributes[4].value == `false`
              ){
        
         document.getElementById(rotatedPosition).setAttribute(`shiphere`, true);
         document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
         document.getElementById(thirdPosition).setAttribute(`shiphere`, true);
         }
    

    // if the big ship is still in the dock
    if(threeShipOne.parentElement.parentElement.id == `shipContainer`){
 
    }
 
    if(threeShipOne.parentElement.parentElement.id == `gridContainer`){
        // lets try a rotate and see where it ends up
        threeShipOne.attributes[5].nodeValue =`horizontal`;
        document.getElementById(secondaryPosition).appendChild(document.getElementById(`threeShipOne`))
        threeShipOne.style.transform = "rotate(90deg) translateX(-40px)";
        //secondaryPosition.style.transform = "translateX(5)";
    }
}
else if(threeShipOne.attributes[5].nodeValue == `horizontal`){

    let firstPosition;
    // correcting the first position 
    if(threeShipOne.parentElement.id[0] == `A`){
        firstPosition = `A${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))+1}`
    }
    else if(threeShipOne.parentElement.id[0] == `B`){
        firstPosition = `B${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))+1}`
    }
    else if(threeShipOne.parentElement.id[0] == `C`){
        firstPosition = `C${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))+1}`
    }
    else if(threeShipOne.parentElement.id[0] == `D`){
        firstPosition = `D${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))+1}`
    }
    else if(threeShipOne.parentElement.id[0] == `E`){
        firstPosition = `E${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))+1}`
    }
    else if(threeShipOne.parentElement.id[0] == `F`){
        firstPosition = `F${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))+1}`
    }
    else if(threeShipOne.parentElement.id[0] == `G`){
        firstPosition = `G${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))+1}`
    }
    else if(threeShipOne.parentElement.id[0] == `H`){
        firstPosition = `H${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))+1}`
    }
    else if(threeShipOne.parentElement.id[0] == `I`){
        firstPosition = `I${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))+1}`
    }
    else if(threeShipOne.parentElement.id[0] == `J`){
        firstPosition = `J${parseInt(threeShipOne.parentElement.id.slice(1,threeShipOne.parentElement.id.length))+1}`
    }
    

    
    let secondaryPosition ='';
    let rotatedPosition='';

    
    if(firstPosition.slice(0,1)==`A`){
        secondaryPosition=`A${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`A${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    if(firstPosition.slice(0,1)==`B`){
        secondaryPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    else if(firstPosition.slice(0,1)==`C`){
        secondaryPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    else if(firstPosition.slice(0,1)==`D`){
        secondaryPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    else if(firstPosition.slice(0,1)==`E`){
        secondaryPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    else if(firstPosition.slice(0,1)==`F`){
        secondaryPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    else if(firstPosition.slice(0,1)==`G`){
        secondaryPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    else if(firstPosition.slice(0,1)==`H`){
        secondaryPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    else if(firstPosition.slice(0,1)==`I`){
        secondaryPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    if(!document.getElementById(`${firstPosition}`) || !document.getElementById(`${secondaryPosition}`) 
    || !document.getElementById(`${thirdPosition}` )){
        return false
    }
    document.getElementById(`${firstPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${secondaryPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${thirdPosition}`).setAttribute(`shiphere`, false);


    console.log(firstPosition)
   
    if(firstPosition[0]=='B'){
        rotatedPosition=`A${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
        secondaryPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
        thirdPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
     }
    else if(firstPosition[0]=='C'){
        rotatedPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
        secondaryPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
        thirdPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
     }
        else if(firstPosition[0]=='D'){
            rotatedPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            secondaryPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            thirdPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='E'){
            rotatedPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            secondaryPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            thirdPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='F'){
            rotatedPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            secondaryPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            thirdPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='G'){
            rotatedPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            secondaryPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            thirdPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='H'){
            rotatedPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            secondaryPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            thirdPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
         else if(firstPosition[0]=='I'){
            rotatedPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            secondaryPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            thirdPosition=`J${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
         console.log(document.getElementById(rotatedPosition).attributes[4].value)
         console.log(secondaryPosition)
         console.log(thirdPosition)

         if(document.getElementById(rotatedPosition).attributes[4].value == `true` 
         || document.getElementById(secondaryPosition).attributes[4].value == `true` 
         || document.getElementById(thirdPosition).attributes[4].value == `true`
             )
             {
                 console.log(secondaryPosition)
                 firstPosition =`${secondaryPosition[0]}${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                 thirdPosition =`${secondaryPosition[0]}${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
                console.log(firstPosition)
                 document.getElementById(firstPosition).attributes[4].value = `true` 
                 
                 document.getElementById(secondaryPosition).attributes[4].value = `true` 
                 document.getElementById(thirdPosition).attributes[4].value = `true` 

                 return console.log(`something in the way `)
             }
         else if(document.getElementById(firstPosition).attributes[4].value == `false` 
         && document.getElementById(secondaryPosition).attributes[4].value == `false` 
         && document.getElementById(thirdPosition).attributes[4].value == `false`
              ){
        
         document.getElementById(rotatedPosition).setAttribute(`shiphere`, true);
         document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
         document.getElementById(thirdPosition).setAttribute(`shiphere`, true);
         }
        

    
    

         console.log(threeShipOne.parentElement.parentElement.id)
         // if the big ship is still in the dock
         if(threeShipOne.parentElement.id == `shipContainer`){
      
         }
      
         if(threeShipOne.parentElement.parentElement.id == `gridContainer`){
             // lets try a rotate and see where it ends up
             threeShipOne.attributes[5].nodeValue =`vertical`;
             document.getElementById(secondaryPosition).appendChild(document.getElementById(`threeShipOne`))
             threeShipOne.style.transform = "rotate(0deg) translateY(-40px)";
             //threeShipOne.style.transform = "translateX(5)" m   translateY(20px) translateX(-20px)  ;
         }
    
}
    
}

function rotatethreeShipTwo (){

    if(threeShipTwo.attributes[5].nodeValue == `vertical`){

    let firstPosition;

    if(threeShipTwo.parentElement.id[0] == `B`){
        firstPosition = `A${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))}`
    }
    else if(threeShipTwo.parentElement.id[0] == `C`){
        firstPosition = `B${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))}`
    }
    else if(threeShipTwo.parentElement.id[0] == `D`){
        firstPosition = `C${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))}`
    }
    else if(threeShipTwo.parentElement.id[0] == `E`){
        firstPosition = `D${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))}`
    }
    else if(threeShipTwo.parentElement.id[0] == `F`){
        firstPosition = `E${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))}`
    }
    else if(threeShipTwo.parentElement.id[0] == `G`){
        firstPosition = `F${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))}`
    }
    else if(threeShipTwo.parentElement.id[0] == `H`){
        firstPosition = `G${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))}`
    }
    else if(threeShipTwo.parentElement.id[0] == `I`){
        firstPosition = `H${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))}`
    }

    let secondaryPosition ='';
    let rotatedPosition='';
    // handling the map falses 

    if(parseInt(firstPosition.slice(1,firstPosition.length)) > 9 || parseInt(firstPosition.slice(1,firstPosition.length)) < 2){
        console.log(`Out of bounds rotation`)
        return false
    }
    

    if(firstPosition.slice(0,1)==`A`){
        secondaryPosition=`B${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`C${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`B`){
        secondaryPosition=`C${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`D${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`C`){
        secondaryPosition=`D${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`E${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`D`){
        secondaryPosition=`E${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`F${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`E`){
        secondaryPosition=`F${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`G${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`F`){
        secondaryPosition=`G${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`H${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`G`){
        secondaryPosition=`H${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`I${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`H`){
        secondaryPosition=`I${firstPosition.slice(1,firstPosition.length)}`
        thirdPosition=`J${firstPosition.slice(1,firstPosition.length)}`
    }

    document.getElementById(`${firstPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${secondaryPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${thirdPosition}`).setAttribute(`shiphere`, false);

    if(firstPosition[0]=='A'){
        rotatedPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
        secondaryPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length))}`
        thirdPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
     }
        else if(firstPosition[0]=='B'){
            rotatedPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            secondaryPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))}`
            thirdPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='C'){
            rotatedPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            secondaryPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))}`
            thirdPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='D'){
            rotatedPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            secondaryPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))}`
            thirdPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='E'){
            rotatedPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            secondaryPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))}`
            thirdPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='F'){
            rotatedPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            secondaryPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))}`
            thirdPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
         else if(firstPosition[0]=='G'){
            rotatedPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            secondaryPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))}`
            thirdPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
         else if(firstPosition[0]=='H'){
            rotatedPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            secondaryPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))}`
            thirdPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
         console.log(rotatedPosition)
         console.log(secondaryPosition)
         console.log(thirdPosition)


         console.log(document.getElementById(firstPosition).attributes[4].value)

         if(document.getElementById(rotatedPosition).attributes[4].value == `true` 
         || document.getElementById(secondaryPosition).attributes[4].value == `true` 
         || document.getElementById(thirdPosition).attributes[4].value == `true`
             )
             {
                 console.log(`something in the way `)


                 if(firstPosition.slice(0,1)==`A`){
                    secondaryPosition=`B${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`C${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`B`){
                    secondaryPosition=`C${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`D${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`C`){
                    secondaryPosition=`D${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`E${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`D`){
                    secondaryPosition=`E${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`F${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`E`){
                    secondaryPosition=`F${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`G${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`F`){
                    secondaryPosition=`G${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`H${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`G`){
                    secondaryPosition=`H${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`I${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`H`){
                    secondaryPosition=`I${firstPosition.slice(1,firstPosition.length)}`
                    thirdPosition=`J${firstPosition.slice(1,firstPosition.length)}`
                }
                document.getElementById(`${firstPosition}`).setAttribute(`shiphere`, true);
                document.getElementById(`${secondaryPosition}`).setAttribute(`shiphere`, true);
                document.getElementById(`${thirdPosition}`).setAttribute(`shiphere`, true);

                 return false
             }
         else if(document.getElementById(rotatedPosition).attributes[4].value == `false` 
         && document.getElementById(secondaryPosition).attributes[4].value == `false` 
         && document.getElementById(thirdPosition).attributes[4].value == `false`
              ){
        
         document.getElementById(rotatedPosition).setAttribute(`shiphere`, true);
         document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
         document.getElementById(thirdPosition).setAttribute(`shiphere`, true);
         }
    

    // if the big ship is still in the dock
    if(threeShipTwo.parentElement.parentElement.id == `shipContainer`){
 
    }
 
    if(threeShipTwo.parentElement.parentElement.id == `gridContainer`){
        // lets try a rotate and see where it ends up
        threeShipTwo.attributes[5].nodeValue =`horizontal`;
        document.getElementById(secondaryPosition).appendChild(document.getElementById(`threeShipTwo`))
        threeShipTwo.style.transform = "rotate(90deg) translateX(-40px)";
        //secondaryPosition.style.transform = "translateX(5)";
    }
}
else if(threeShipTwo.attributes[5].nodeValue == `horizontal`){

    let firstPosition;
    // correcting the first position 
    if(threeShipTwo.parentElement.id[0] == `A`){
        firstPosition = `A${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))+1}`
    }
    else if(threeShipTwo.parentElement.id[0] == `B`){
        firstPosition = `B${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))+1}`
    }
    else if(threeShipTwo.parentElement.id[0] == `C`){
        firstPosition = `C${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))+1}`
    }
    else if(threeShipTwo.parentElement.id[0] == `D`){
        firstPosition = `D${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))+1}`
    }
    else if(threeShipTwo.parentElement.id[0] == `E`){
        firstPosition = `E${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))+1}`
    }
    else if(threeShipTwo.parentElement.id[0] == `F`){
        firstPosition = `F${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))+1}`
    }
    else if(threeShipTwo.parentElement.id[0] == `G`){
        firstPosition = `G${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))+1}`
    }
    else if(threeShipTwo.parentElement.id[0] == `H`){
        firstPosition = `H${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))+1}`
    }
    else if(threeShipTwo.parentElement.id[0] == `I`){
        firstPosition = `I${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))+1}`
    }
    else if(threeShipTwo.parentElement.id[0] == `J`){
        firstPosition = `J${parseInt(threeShipTwo.parentElement.id.slice(1,threeShipTwo.parentElement.id.length))+1}`
    }
    

    
    let secondaryPosition ='';
    let rotatedPosition='';

    
    if(firstPosition.slice(0,1)==`A`){
        secondaryPosition=`A${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`A${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    if(firstPosition.slice(0,1)==`B`){
        secondaryPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    else if(firstPosition.slice(0,1)==`C`){
        secondaryPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    else if(firstPosition.slice(0,1)==`D`){
        secondaryPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    else if(firstPosition.slice(0,1)==`E`){
        secondaryPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    else if(firstPosition.slice(0,1)==`F`){
        secondaryPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    else if(firstPosition.slice(0,1)==`G`){
        secondaryPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    else if(firstPosition.slice(0,1)==`H`){
        secondaryPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    else if(firstPosition.slice(0,1)==`I`){
        secondaryPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        thirdPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length)-2)}`
    }
    if(!document.getElementById(`${firstPosition}`) || !document.getElementById(`${secondaryPosition}`) 
    || !document.getElementById(`${thirdPosition}` )){
        return false
    }
    document.getElementById(`${firstPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${secondaryPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${thirdPosition}`).setAttribute(`shiphere`, false);


    console.log(firstPosition)
   
    if(firstPosition[0]=='B'){
        rotatedPosition=`A${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
        secondaryPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
        thirdPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
     }
    else if(firstPosition[0]=='C'){
        rotatedPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
        secondaryPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
        thirdPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
     }
        else if(firstPosition[0]=='D'){
            rotatedPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            secondaryPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            thirdPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='E'){
            rotatedPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            secondaryPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            thirdPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='F'){
            rotatedPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            secondaryPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            thirdPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='G'){
            rotatedPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            secondaryPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            thirdPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='H'){
            rotatedPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            secondaryPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            thirdPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
         else if(firstPosition[0]=='I'){
            rotatedPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            secondaryPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
            thirdPosition=`J${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
         console.log(document.getElementById(rotatedPosition).attributes[4].value)
         console.log(secondaryPosition)
         console.log(thirdPosition)

         if(document.getElementById(rotatedPosition).attributes[4].value == `true` 
         || document.getElementById(secondaryPosition).attributes[4].value == `true` 
         || document.getElementById(thirdPosition).attributes[4].value == `true`
             )
             {
                 console.log(secondaryPosition)
                 firstPosition =`${secondaryPosition[0]}${parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1}`
                 thirdPosition =`${secondaryPosition[0]}${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`
                console.log(firstPosition)
                 document.getElementById(firstPosition).attributes[4].value = `true` 
                 
                 document.getElementById(secondaryPosition).attributes[4].value = `true` 
                 document.getElementById(thirdPosition).attributes[4].value = `true` 

                 return console.log(`something in the way `)
             }
         else if(document.getElementById(firstPosition).attributes[4].value == `false` 
         && document.getElementById(secondaryPosition).attributes[4].value == `false` 
         && document.getElementById(thirdPosition).attributes[4].value == `false`
              ){
        
         document.getElementById(rotatedPosition).setAttribute(`shiphere`, true);
         document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
         document.getElementById(thirdPosition).setAttribute(`shiphere`, true);
         }
        

    
    

         console.log(threeShipTwo.parentElement.parentElement.id)
         // if the big ship is still in the dock
         if(threeShipTwo.parentElement.id == `shipContainer`){
      
         }
      
         if(threeShipTwo.parentElement.parentElement.id == `gridContainer`){
             // lets try a rotate and see where it ends up
             threeShipTwo.attributes[5].nodeValue =`vertical`;
             document.getElementById(secondaryPosition).appendChild(document.getElementById(`threeShipTwo`))
             threeShipTwo.style.transform = "rotate(0deg) translateY(-40px)";
             //threeShipTwo.style.transform = "translateX(5)" m   translateY(20px) translateX(-20px)  ;
         }
    
}
    
}

function rotatefourLongShip (){


    if(fourLongShip.attributes[5].nodeValue == `vertical`){

    let firstPosition = fourLongShip.parentElement.id
    if(fourLongShip.parentElement.id[0] == `C`){
        firstPosition = `A${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))}`
    }
    else if(fourLongShip.parentElement.id[0] == `D`){
        firstPosition = `B${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))}`
    }
    else if(fourLongShip.parentElement.id[0] == `E`){
        firstPosition = `C${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))}`
    }
    else if(fourLongShip.parentElement.id[0] == `F`){
        firstPosition = `D${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))}`
    }
    else if(fourLongShip.parentElement.id[0] == `G`){
        firstPosition = `E${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))}`
    }
    else if(fourLongShip.parentElement.id[0] == `H`){
        firstPosition = `F${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))}`
    }
    else if(fourLongShip.parentElement.id[0] == `I`){
        firstPosition = `G${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))}`
    }

    let secondaryPosition ='';
    let rotatedPosition='';
    // handling the map falses 

    if(parseInt(firstPosition.slice(1,firstPosition.length)) > 8 || parseInt(firstPosition.slice(1,firstPosition.length)) < 2){
        console.log(`Out of bounds rotation`)
        return false
    }
    

    if(firstPosition.slice(0,1)==`A`){
        secondaryPosition=`B${firstPosition.slice(1,firstPosition.length)}`
        fourthPosition=`D${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`B`){
        secondaryPosition=`C${firstPosition.slice(1,firstPosition.length)}`
        fourthPosition=`E${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`C`){
        secondaryPosition=`D${firstPosition.slice(1,firstPosition.length)}`
        fourthPosition=`F${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`D`){
        secondaryPosition=`E${firstPosition.slice(1,firstPosition.length)}`
        fourthPosition=`G${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`E`){
        secondaryPosition=`F${firstPosition.slice(1,firstPosition.length)}`
        fourthPosition=`H${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`F`){
        secondaryPosition=`G${firstPosition.slice(1,firstPosition.length)}`
        fourthPosition=`I${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`G`){
        
        secondaryPosition=`H${firstPosition.slice(1,firstPosition.length)}`
        fourthPosition=`J${firstPosition.slice(1,firstPosition.length)}`
    }
    console.log(firstPosition)
    document.getElementById(`${firstPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${secondaryPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${fourthPosition}`).setAttribute(`shiphere`, false);

    if(firstPosition[0]=='A'){
        rotatedPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))+2}`
        secondaryPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
        thirdPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))}`;
        fourthPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
     }
        else if(firstPosition[0]=='B'){
            rotatedPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))+2}`
            secondaryPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            thirdPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))}`;
            fourthPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='C'){
            rotatedPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))+2}`
            secondaryPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            thirdPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))}`;
            fourthPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='D'){
            rotatedPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))+2}`
            secondaryPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            thirdPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))}`;
            fourthPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='E'){
            rotatedPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))+2}`
            secondaryPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            thirdPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))}`;
            fourthPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
        else if(firstPosition[0]=='F'){
            rotatedPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))+2}`
            secondaryPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            thirdPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))}`;
            fourthPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
         else if(firstPosition[0]=='G'){
            rotatedPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))+2}`
            secondaryPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            thirdPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))}`;
            fourthPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
         }
         
         console.log(document.getElementById(firstPosition).attributes[4].value)

         if(document.getElementById(rotatedPosition).attributes[4].value == `true` 
         || document.getElementById(secondaryPosition).attributes[4].value == `true` 
         || document.getElementById(fourthPosition).attributes[4].value == `true`
             )
             {
                 console.log(`something in the way `)


                 if(firstPosition.slice(0,1)==`A`){
                    secondaryPosition=`B${firstPosition.slice(1,firstPosition.length)}`
                    fourthPosition=`D${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`B`){
                    secondaryPosition=`C${firstPosition.slice(1,firstPosition.length)}`
                    fourthPosition=`E${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`C`){
                    secondaryPosition=`D${firstPosition.slice(1,firstPosition.length)}`
                    fourthPosition=`F${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`D`){
                    secondaryPosition=`E${firstPosition.slice(1,firstPosition.length)}`
                    fourthPosition=`G${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`E`){
                    secondaryPosition=`F${firstPosition.slice(1,firstPosition.length)}`
                    fourthPosition=`H${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`F`){
                    secondaryPosition=`G${firstPosition.slice(1,firstPosition.length)}`
                    fourthPosition=`I${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`G`){
                    secondaryPosition=`H${firstPosition.slice(1,firstPosition.length)}`
                    fourthPosition=`J${firstPosition.slice(1,firstPosition.length)}`
                }
                document.getElementById(`${firstPosition}`).setAttribute(`shiphere`, true);
                document.getElementById(`${secondaryPosition}`).setAttribute(`shiphere`, true);
                document.getElementById(`${fourthPosition}`).setAttribute(`shiphere`, true);







                 return false
             }
         else if(document.getElementById(firstPosition).attributes[4].value == `false` 
         && document.getElementById(secondaryPosition).attributes[4].value == `false` 
         && document.getElementById(fourthPosition).attributes[4].value == `false`
              ){
        
         document.getElementById(rotatedPosition).setAttribute(`shiphere`, true);
         document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
         document.getElementById(thirdPosition).setAttribute(`shiphere`, true);
         document.getElementById(fourthPosition).setAttribute(`shiphere`, true);
         }
        

    


    // if the big ship is still in the dock
    if(fourLongShip.parentElement.parentElement.id == `shipContainer`){
 
    }
 
    if(fourLongShip.parentElement.parentElement.id == `gridContainer`){
        // lets try a rotate and see where it ends up
        fourLongShip.attributes[5].nodeValue =`horizontal`;
        document.getElementById(thirdPosition).appendChild(document.getElementById(`fourLongShip`))
        fourLongShip.style.transform = "rotate(90deg) translateX(-60px) translateY(-20px)";
        //fourLongShip.style.transform = "translateX(5)";
    }
}
else if(fourLongShip.attributes[5].nodeValue == `horizontal`){

    let firstPosition = fourLongShip.parentElement.id;
    // correcting the first position 
    if(fourLongShip.parentElement.id[0] == `A`){
        firstPosition = `A${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))+2}`
    }
    else if(fourLongShip.parentElement.id[0] == `B`){
        firstPosition = `B${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))+2}`
    }
    else if(fourLongShip.parentElement.id[0] == `C`){
        firstPosition = `C${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))+2}`
    }
    else if(fourLongShip.parentElement.id[0] == `D`){
        firstPosition = `D${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))+2}`
    }
    else if(fourLongShip.parentElement.id[0] == `E`){
        firstPosition = `E${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))+2}`
    }
    else if(fourLongShip.parentElement.id[0] == `F`){
        firstPosition = `F${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))+2}`
    }
    else if(fourLongShip.parentElement.id[0] == `G`){
        firstPosition = `G${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))+2}`
    }
    else if(fourLongShip.parentElement.id[0] == `H`){
        firstPosition = `H${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))+2}`
    }
    else if(fourLongShip.parentElement.id[0] == `I`){
        firstPosition = `I${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))+2}`
    }
    else if(fourLongShip.parentElement.id[0] == `J`){
        firstPosition = `J${parseInt(fourLongShip.parentElement.id.slice(1,fourLongShip.parentElement.id.length))+2}`
    }
    

    
    let secondaryPosition ='';
    let rotatedPosition='';

    if(firstPosition.slice(0,1)==`C`){
        secondaryPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        fourthPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length)-3)}`
    }
    else if(firstPosition.slice(0,1)==`D`){
        secondaryPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        fourthPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length)-3)}`
    }
    else if(firstPosition.slice(0,1)==`E`){
        secondaryPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        fourthPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length)-3)}`
    }
    else if(firstPosition.slice(0,1)==`F`){
        secondaryPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        fourthPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length)-3)}`
    }
    else if(firstPosition.slice(0,1)==`G`){
        secondaryPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        fourthPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length)-3)}`
    }
    else if(firstPosition.slice(0,1)==`H`){
        secondaryPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        fourthPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length)-3)}`
    }
    else if(firstPosition.slice(0,1)==`I`){
        secondaryPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        fourthPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length)-3)}`
    }
    if(!document.getElementById(`${firstPosition}`) || !document.getElementById(`${secondaryPosition}`) 
    || !document.getElementById(`${fourthPosition}` )){
        return false
    }
    document.getElementById(`${firstPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${secondaryPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${fourthPosition}`).setAttribute(`shiphere`, false);


    console.log(firstPosition)
   
    if(firstPosition[0]=='C'){
        rotatedPosition=`A${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
        secondaryPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
        thirdPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
        fourthPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
     }
        else if(firstPosition[0]=='D'){
            rotatedPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            secondaryPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            thirdPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fourthPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
        else if(firstPosition[0]=='E'){
            rotatedPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            secondaryPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            thirdPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fourthPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
        else if(firstPosition[0]=='F'){
            rotatedPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            secondaryPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            thirdPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fourthPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
        else if(firstPosition[0]=='G'){
            rotatedPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            secondaryPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            thirdPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fourthPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
        else if(firstPosition[0]=='H'){
            rotatedPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            secondaryPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            thirdPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fourthPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
         else if(firstPosition[0]=='I'){
            rotatedPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            secondaryPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            thirdPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fourthPosition=`J${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
         console.log(document.getElementById(rotatedPosition).attributes[4].value)
         console.log(secondaryPosition)
         console.log(fourthPosition)

         if(document.getElementById(rotatedPosition).attributes[4].value == `true` 
         || document.getElementById(secondaryPosition).attributes[4].value == `true` 
         || document.getElementById(fourthPosition).attributes[4].value == `true`
             )
             {
                 console.log(thirdPosition)
                 firstPosition =`${thirdPosition[0]}${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                 secondaryPosition =`${thirdPosition[0]}${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                 fourthPosition =`${thirdPosition[0]}${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                console.log(firstPosition)
                 document.getElementById(firstPosition).attributes[4].value = `true` 
                 
                 document.getElementById(secondaryPosition).attributes[4].value = `true` 
                 document.getElementById(fourthPosition).attributes[4].value = `true` 

                 return console.log(`something in the way `)
             }
         else if(document.getElementById(firstPosition).attributes[4].value == `false` 
         && document.getElementById(secondaryPosition).attributes[4].value == `false` 
         && document.getElementById(fourthPosition).attributes[4].value == `false`
              ){
        
         document.getElementById(rotatedPosition).setAttribute(`shiphere`, true);
         document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
         document.getElementById(thirdPosition).setAttribute(`shiphere`, true);
         document.getElementById(fourthPosition).setAttribute(`shiphere`, true);
         }
        

    
    

         console.log(fourLongShip.parentElement.parentElement.id)
         // if the big ship is still in the dock
         if(fourLongShip.parentElement.id == `shipContainer`){
      
         }
      
         if(fourLongShip.parentElement.parentElement.id == `gridContainer`){
             // lets try a rotate and see where it ends up
             fourLongShip.attributes[5].nodeValue =`vertical`;
             document.getElementById(thirdPosition).appendChild(document.getElementById(`fourLongShip`))
             fourLongShip.style.transform = "rotate(0deg) translateY(-80px)";
             //fourLongShip.style.transform = "translateX(5)" m   translateY(20px) translateX(-20px)  ;
         }
    
}
    
}

function rotateBigShip (){


    if(bigShip.attributes[5].nodeValue == `vertical`){

    let firstPosition = bigShip.parentElement.id
    if(bigShip.parentElement.id[0] == `C`){
        firstPosition = `A${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))}`
    }
    else if(bigShip.parentElement.id[0] == `D`){
        firstPosition = `B${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))}`
    }
    else if(bigShip.parentElement.id[0] == `E`){
        firstPosition = `C${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))}`
    }
    else if(bigShip.parentElement.id[0] == `F`){
        firstPosition = `D${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))}`
    }
    else if(bigShip.parentElement.id[0] == `G`){
        firstPosition = `E${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))}`
    }
    else if(bigShip.parentElement.id[0] == `H`){
        firstPosition = `F${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))}`
    }

    let secondaryPosition ='';
    let rotatedPosition='';
    // handling the map falses 

    if(parseInt(firstPosition.slice(1,firstPosition.length)) > 8 || parseInt(firstPosition.slice(1,firstPosition.length)) < 3){
        console.log(`Out of bounds rotation`)
        return false
    }
    

    if(firstPosition.slice(0,1)==`A`){
        secondaryPosition=`B${firstPosition.slice(1,firstPosition.length)}`
        fourthPosition=`D${firstPosition.slice(1,firstPosition.length)}`
        fifthPosition=`E${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`B`){
        secondaryPosition=`C${firstPosition.slice(1,firstPosition.length)}`
        fourthPosition=`E${firstPosition.slice(1,firstPosition.length)}`
        fifthPosition=`F${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`C`){
        secondaryPosition=`D${firstPosition.slice(1,firstPosition.length)}`
        fourthPosition=`F${firstPosition.slice(1,firstPosition.length)}`
        fifthPosition=`G${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`D`){
        secondaryPosition=`E${firstPosition.slice(1,firstPosition.length)}`
        fourthPosition=`G${firstPosition.slice(1,firstPosition.length)}`
        fifthPosition=`H${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`E`){
        secondaryPosition=`F${firstPosition.slice(1,firstPosition.length)}`
        fourthPosition=`H${firstPosition.slice(1,firstPosition.length)}`
        fifthPosition=`I${firstPosition.slice(1,firstPosition.length)}`
    }
    else if(firstPosition.slice(0,1)==`F`){
        secondaryPosition=`G${firstPosition.slice(1,firstPosition.length)}`
        fourthPosition=`I${firstPosition.slice(1,firstPosition.length)}`
        fifthPosition=`J${firstPosition.slice(1,firstPosition.length)}`
    }
    document.getElementById(`${firstPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${secondaryPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${fourthPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${fifthPosition}`).setAttribute(`shiphere`, false);

    
    
   
    if(firstPosition[0]=='A'){
        rotatedPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))+2}`
        secondaryPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
        thirdPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))}`;
        fourthPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
        fifthPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
     }
        else if(firstPosition[0]=='B'){
            rotatedPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))+2}`
            secondaryPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            thirdPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))}`;
            fourthPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
            fifthPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
        else if(firstPosition[0]=='C'){
            rotatedPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))+2}`
            secondaryPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            thirdPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))}`;
            fourthPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
            fifthPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
        else if(firstPosition[0]=='D'){
            rotatedPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))+2}`
            secondaryPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            thirdPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))}`;
            fourthPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
            fifthPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
        else if(firstPosition[0]=='E'){
            rotatedPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))+2}`
            secondaryPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            thirdPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))}`;
            fourthPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
            fifthPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
        else if(firstPosition[0]=='F'){
            rotatedPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))+2}`
            secondaryPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))+1}`
            thirdPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))}`;
            fourthPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-1}`;
            fifthPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
         
         console.log(document.getElementById(firstPosition).attributes[4].value)

         if(document.getElementById(rotatedPosition).attributes[4].value == `true` 
         || document.getElementById(secondaryPosition).attributes[4].value == `true` 
         || document.getElementById(fourthPosition).attributes[4].value == `true`
         || document.getElementById(fifthPosition).attributes[4].value == `true`
             )
             {
                 console.log(`something in the way `)


                 if(firstPosition.slice(0,1)==`A`){
                    secondaryPosition=`B${firstPosition.slice(1,firstPosition.length)}`
                    fourthPosition=`D${firstPosition.slice(1,firstPosition.length)}`
                    fifthPosition=`E${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`B`){
                    secondaryPosition=`C${firstPosition.slice(1,firstPosition.length)}`
                    fourthPosition=`E${firstPosition.slice(1,firstPosition.length)}`
                    fifthPosition=`F${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`C`){
                    secondaryPosition=`D${firstPosition.slice(1,firstPosition.length)}`
                    fourthPosition=`F${firstPosition.slice(1,firstPosition.length)}`
                    fifthPosition=`G${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`D`){
                    secondaryPosition=`E${firstPosition.slice(1,firstPosition.length)}`
                    fourthPosition=`G${firstPosition.slice(1,firstPosition.length)}`
                    fifthPosition=`H${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`E`){
                    secondaryPosition=`F${firstPosition.slice(1,firstPosition.length)}`
                    fourthPosition=`H${firstPosition.slice(1,firstPosition.length)}`
                    fifthPosition=`I${firstPosition.slice(1,firstPosition.length)}`
                }
                else if(firstPosition.slice(0,1)==`F`){
                    secondaryPosition=`G${firstPosition.slice(1,firstPosition.length)}`
                    fourthPosition=`I${firstPosition.slice(1,firstPosition.length)}`
                    fifthPosition=`J${firstPosition.slice(1,firstPosition.length)}`
                }
                document.getElementById(`${firstPosition}`).setAttribute(`shiphere`, true);
                document.getElementById(`${secondaryPosition}`).setAttribute(`shiphere`, true);
                document.getElementById(`${fourthPosition}`).setAttribute(`shiphere`, true);
                document.getElementById(`${fifthPosition}`).setAttribute(`shiphere`, true);

                 return false
             }
         else if(document.getElementById(firstPosition).attributes[4].value == `false` 
         && document.getElementById(secondaryPosition).attributes[4].value == `false` 
         && document.getElementById(fourthPosition).attributes[4].value == `false`
         && document.getElementById(fifthPosition).attributes[4].value == `false`
              ){
        
         document.getElementById(rotatedPosition).setAttribute(`shiphere`, true);
         document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
         document.getElementById(thirdPosition).setAttribute(`shiphere`, true);
         document.getElementById(fourthPosition).setAttribute(`shiphere`, true);
         document.getElementById(fifthPosition).setAttribute(`shiphere`, true);
         }
        
    console.log(bigShip.parentElement.parentElement.id)
    // if the big ship is still in the dock
    if(bigShip.parentElement.id == `shipContainer`){
 
    }
 
    if(bigShip.parentElement.parentElement.id == `gridContainer`){
        // lets try a rotate and see where it ends up
        bigShip.attributes[5].nodeValue =`horizontal`;
        document.getElementById(thirdPosition).appendChild(document.getElementById(`biggestShip`))
        bigShip.style.transform = "rotate(90deg) translateX(-80px)";
        //bigShip.style.transform = "translateX(5)";
    }
}
else if(bigShip.attributes[5].nodeValue == `horizontal`){

    let firstPosition = bigShip.parentElement.id;
    // correcting the first position 
    if(bigShip.parentElement.id[0] == `A`){
        firstPosition = `A${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))+2}`
    }
    else if(bigShip.parentElement.id[0] == `B`){
        firstPosition = `B${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))+2}`
    }
    else if(bigShip.parentElement.id[0] == `C`){
        firstPosition = `C${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))+2}`
    }
    else if(bigShip.parentElement.id[0] == `D`){
        firstPosition = `D${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))+2}`
    }
    else if(bigShip.parentElement.id[0] == `E`){
        firstPosition = `E${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))+2}`
    }
    else if(bigShip.parentElement.id[0] == `F`){
        firstPosition = `F${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))+2}`
    }
    else if(bigShip.parentElement.id[0] == `G`){
        firstPosition = `G${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))+2}`
    }
    else if(bigShip.parentElement.id[0] == `H`){
        firstPosition = `H${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))+2}`
    }
    else if(bigShip.parentElement.id[0] == `I`){
        firstPosition = `I${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))+2}`
    }
    else if(bigShip.parentElement.id[0] == `J`){
        firstPosition = `J${parseInt(bigShip.parentElement.id.slice(1,bigShip.parentElement.id.length))+2}`
    }
    
    let secondaryPosition ='';
    let rotatedPosition='';

    if(firstPosition.slice(0,1)==`C`){
        secondaryPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        fourthPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length)-3)}`
        fifthPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length)-4)}`
    }
    else if(firstPosition.slice(0,1)==`D`){
        secondaryPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        fourthPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length)-3)}`
        fifthPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length)-4)}`
    }
    else if(firstPosition.slice(0,1)==`E`){
        secondaryPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        fourthPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length)-3)}`
        fifthPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length)-4)}`
    }
    else if(firstPosition.slice(0,1)==`F`){
        secondaryPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        fourthPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length)-3)}`
        fifthPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length)-4)}`
    }
    else if(firstPosition.slice(0,1)==`G`){
        secondaryPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        fourthPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length)-3)}`
        fifthPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length)-4)}`
    }
    else if(firstPosition.slice(0,1)==`H`){
        secondaryPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length)-1)}`
        fourthPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length)-3)}`
        fifthPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length)-4)}`
    }
    if(!document.getElementById(`${firstPosition}`) || !document.getElementById(`${secondaryPosition}`) 
    || !document.getElementById(`${fourthPosition}` || !document.getElementById(`${fifthPosition}`))){
        return false
    }
    document.getElementById(`${firstPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${secondaryPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${fourthPosition}`).setAttribute(`shiphere`, false);
    document.getElementById(`${fifthPosition}`).setAttribute(`shiphere`, false);

    console.log(firstPosition)
   
    if(firstPosition[0]=='C'){
        rotatedPosition=`A${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
        secondaryPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
        thirdPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
        fourthPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
        fifthPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
     }
        else if(firstPosition[0]=='D'){
            rotatedPosition=`B${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            secondaryPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            thirdPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fourthPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fifthPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
        else if(firstPosition[0]=='E'){
            rotatedPosition=`C${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            secondaryPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            thirdPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fourthPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fifthPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
        else if(firstPosition[0]=='F'){
            rotatedPosition=`D${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            secondaryPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            thirdPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fourthPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fifthPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
        else if(firstPosition[0]=='G'){
            rotatedPosition=`E${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            secondaryPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            thirdPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fourthPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fifthPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
        else if(firstPosition[0]=='H'){
            rotatedPosition=`F${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            secondaryPosition=`G${parseInt(firstPosition.slice(1,firstPosition.length))-2}`
            thirdPosition=`H${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fourthPosition=`I${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
            fifthPosition=`J${parseInt(firstPosition.slice(1,firstPosition.length))-2}`;
         }
         console.log(document.getElementById(rotatedPosition).attributes[4].value)
         console.log(secondaryPosition)
         console.log(fourthPosition)
         console.log(fifthPosition)
         if(document.getElementById(rotatedPosition).attributes[4].value == `true` 
         || document.getElementById(secondaryPosition).attributes[4].value == `true` 
         || document.getElementById(fourthPosition).attributes[4].value == `true`
         || document.getElementById(fifthPosition).attributes[4].value == `true`
             )
             {
                 console.log(thirdPosition)
                 firstPosition =`${thirdPosition[0]}${parseInt(thirdPosition.slice(1,thirdPosition.length))+2}`
                 secondaryPosition =`${thirdPosition[0]}${parseInt(thirdPosition.slice(1,thirdPosition.length))+1}`
                 fourthPosition =`${thirdPosition[0]}${parseInt(thirdPosition.slice(1,thirdPosition.length))-1}`
                 fifthPosition =`${thirdPosition[0]}${parseInt(thirdPosition.slice(1,thirdPosition.length))-2}`
                console.log(firstPosition)
                 document.getElementById(firstPosition).attributes[4].value = `true` 
                 document.getElementById(secondaryPosition).attributes[4].value = `true` 
                 document.getElementById(fourthPosition).attributes[4].value = `true` 
                 document.getElementById(fifthPosition).attributes[4].value = `true` 

                 return console.log(`something in the way `)
             }
         else if(document.getElementById(firstPosition).attributes[4].value == `false` 
         && document.getElementById(secondaryPosition).attributes[4].value == `false` 
         && document.getElementById(fourthPosition).attributes[4].value == `false`
         && document.getElementById(fifthPosition).attributes[4].value == `false`
              ){
        
         document.getElementById(rotatedPosition).setAttribute(`shiphere`, true);
         document.getElementById(secondaryPosition).setAttribute(`shiphere`, true);
         document.getElementById(thirdPosition).setAttribute(`shiphere`, true);
         document.getElementById(fourthPosition).setAttribute(`shiphere`, true);
         document.getElementById(fifthPosition).setAttribute(`shiphere`, true);
         }
        

    
    

         console.log(bigShip.parentElement.parentElement.id)
         // if the big ship is still in the dock
         if(bigShip.parentElement.id == `shipContainer`){
      
         }
      
         if(bigShip.parentElement.parentElement.id == `gridContainer`){
             // lets try a rotate and see where it ends up
             bigShip.attributes[5].nodeValue =`vertical`;
             document.getElementById(thirdPosition).appendChild(document.getElementById(`biggestShip`))
             bigShip.style.transform = "rotate(0deg) translateY(-80px)";
             //bigShip.style.transform = "translateX(5)" m   translateY(20px) translateX(-20px)  ;
         }
    
}
    
}

function rotateSmallestShip (){
   // getting the current first and secondary postition if it's veritcal or not

    let firstPosition = smallShip.parentElement.id;
    let secondaryPosition ='';
    let rotatedPosition='';
    // error handling for if the small ship is at the top of the page and the user double clicks
    if(smallShip.attributes[5].nodeValue == `horizontal` && smallShip.parentElement.id[0]==`A`){

        return false
    }
    if(firstPosition[0]=='A'){secondaryPosition=`B`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='B'){secondaryPosition=`C`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='C'){secondaryPosition=`D`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='D'){secondaryPosition=`E`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='E'){secondaryPosition=`F`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='F'){secondaryPosition=`G`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='G'){secondaryPosition=`H`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='H'){secondaryPosition=`I`+firstPosition.slice(1,firstPosition.length)}
            else if(firstPosition[0]=='I'){secondaryPosition=`J`+firstPosition.slice(1,firstPosition.length)}
            // if the obj has been moved while rotated
            if(round>0){
               
                if(secondaryPosition[0] == `B`){rotatedPosition=`A${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0] == `C`){rotatedPosition=`B${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0] == `D`){rotatedPosition=`C${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0] == `E`){rotatedPosition=`D${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0] == `F`){rotatedPosition=`E${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0] == `G`){rotatedPosition=`F${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0] == `H`){rotatedPosition=`G${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0] == `I`){rotatedPosition=`H${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                else if(secondaryPosition[0] == `J`){rotatedPosition=`I${parseInt(secondaryPosition.slice(1,secondaryPosition.length))-1}`}
                
            }
            else{
            rotatedPosition = `${secondaryPosition.slice(0,1)}${(parseInt(secondaryPosition.slice(1,secondaryPosition.length))+1)}`
            }
    //}

    // I have the positions, now I need to move the top one over and down one
    //console.log(firstPosition)
    //console.log(secondaryPosition)
    //console.log(rotatedPosition)
    if(smallShip.attributes[5].nodeValue == `vertical`){
        
        // if the big ship is still in the dock
        if(smallShip.parentElement.id == `shipContainer`){
        
        }
        // if it's not still in the dock
        else{
            
            //console.log(document.getElementById(rotatedPosition).attributes[4].value)
            if(document.getElementById(rotatedPosition).attributes[4].value == `false`){
            document.getElementById(firstPosition).attributes[4].value = `false`
            
            document.getElementById(rotatedPosition).attributes[4].value = `true`

            document.getElementById(rotatedPosition).appendChild(document.getElementById(`smallShip`))
            smallShip.style.transform = "rotate(90deg) translateY(20px) translateX(-20px)";
            smallShip.attributes[5].nodeValue = `horizontal`
            }
        }
       
    }
    else if(smallShip.attributes[5].nodeValue == `horizontal`){
      
        // errTest for flipping back to vertical
        let errTest;
        if(firstPosition[0]==`J`){errTest=`I${parseInt(firstPosition.slice(1,firstPosition.length))-1}`}
        else if(firstPosition[0]==`I`){errTest=`H${parseInt(firstPosition.slice(1,firstPosition.length))-1}`}
        else if(firstPosition[0]==`H`){errTest=`G${parseInt(firstPosition.slice(1,firstPosition.length))-1}`}
        else if(firstPosition[0]==`G`){errTest=`F${parseInt(firstPosition.slice(1,firstPosition.length))-1}`}
        else if(firstPosition[0]==`F`){errTest=`E${parseInt(firstPosition.slice(1,firstPosition.length))-1}`}
        else if(firstPosition[0]==`E`){errTest=`D${parseInt(firstPosition.slice(1,firstPosition.length))-1}`}
        else if(firstPosition[0]==`D`){errTest=`C${parseInt(firstPosition.slice(1,firstPosition.length))-1}`}
        else if(firstPosition[0]==`C`){errTest=`B${parseInt(firstPosition.slice(1,firstPosition.length))-1}`}
        else if(firstPosition[0]==`B`){errTest=`A${parseInt(firstPosition.slice(1,firstPosition.length))-1}`}

        // to be marked false
        if( document.getElementById(errTest).attributes[4].value == `true`){
            return false
        }
        else{}
        secondaryPosition= `${firstPosition.slice(0,1)}${parseInt(firstPosition.slice(1,firstPosition.length))-1}`
        // to be kept true
        if(secondaryPosition.slice(0,1)==`B`){rotatedPosition=`${`A`}${parseInt(secondaryPosition.slice(1,secondaryPosition.length))}`}
        else if(secondaryPosition.slice(0,1)==`C`){rotatedPosition=`${`B`}${parseInt(secondaryPosition.slice(1,secondaryPosition.length))}`}
        else if(secondaryPosition.slice(0,1)==`D`){rotatedPosition=`${`C`}${parseInt(secondaryPosition.slice(1,secondaryPosition.length))}`}
        else if(secondaryPosition.slice(0,1)==`E`){rotatedPosition=`${`D`}${parseInt(secondaryPosition.slice(1,secondaryPosition.length))}`}
        else if(secondaryPosition.slice(0,1)==`F`){rotatedPosition=`${`E`}${parseInt(secondaryPosition.slice(1,secondaryPosition.length))}`}
        else if(secondaryPosition.slice(0,1)==`G`){rotatedPosition=`${`F`}${parseInt(secondaryPosition.slice(1,secondaryPosition.length))}`}
        else if(secondaryPosition.slice(0,1)==`H`){rotatedPosition=`${`G`}${parseInt(secondaryPosition.slice(1,secondaryPosition.length))}`}
        else if(secondaryPosition.slice(0,1)==`I`){rotatedPosition=`${`H`}${parseInt(secondaryPosition.slice(1,secondaryPosition.length))}`}
        else if(secondaryPosition.slice(0,1)==`J`){rotatedPosition=`${`I`}${parseInt(secondaryPosition.slice(1,secondaryPosition.length))}`}
        console.log(document.getElementById(secondaryPosition))

        // c3
        // if it's still in the container don't let them rotate the piece
        if(smallShip.parentElement.id == `shipContainer`){}
        else{
            document.getElementById(firstPosition).attributes[4].value = `false`
            if(round>0){
                document.getElementById(rotatedPosition).attributes[4].value = `true`
                document.getElementById(secondaryPosition).attributes[4].value = `true`
                round = 0  
            }
            else{
            document.getElementById(rotatedPosition).attributes[4].value = `false`
            }
            document.getElementById(rotatedPosition).attributes[4].value = `true`
            document.getElementById(rotatedPosition).appendChild(document.getElementById(`smallShip`))
            smallShip.style.transform = "rotate(0deg)";
            smallShip.attributes[5].nodeValue = `vertical`
           
        }
    }
    smallShip.setAttribute(`rotatedPosition`,rotatedPosition);
    }

let theirA1 = document.getElementById("theirA1");
let theirA2 = document.getElementById("theirA2");
let theirA3 = document.getElementById("theirA3");
let theirA4 = document.getElementById("theirA4");
let theirA5 = document.getElementById("theirA5");
let theirA6 = document.getElementById("theirA6");
let theirA7 = document.getElementById("theirA7");
let theirA8 = document.getElementById("theirA8");
let theirA9 = document.getElementById("theirA9");
let theirA10 = document.getElementById("theirA10");

let theirB1 = document.getElementById("theirB1");
let theirB2 = document.getElementById("theirB2");
let theirB3 = document.getElementById("theirB3");
let theirB4 = document.getElementById("theirB4");
let theirB5 = document.getElementById("theirB5");
let theirB6 = document.getElementById("theirB6");
let theirB7 = document.getElementById("theirB7");
let theirB8 = document.getElementById("theirB8");
let theirB9 = document.getElementById("theirB9");
let theirB10 = document.getElementById("theirB10");

let theirC1 = document.getElementById("theirC1");
let theirC2 = document.getElementById("theirC2");
let theirC3 = document.getElementById("theirC3");
let theirC4 = document.getElementById("theirC4");
let theirC5 = document.getElementById("theirC5");
let theirC6 = document.getElementById("theirC6");
let theirC7 = document.getElementById("theirC7");
let theirC8 = document.getElementById("theirC8");
let theirC9 = document.getElementById("theirC9");
let theirC10 = document.getElementById("theirC10");

let theirD1 = document.getElementById("theirD1");
let theirD2 = document.getElementById("theirD2");
let theirD3 = document.getElementById("theirD3");
let theirD4 = document.getElementById("theirD4");
let theirD5 = document.getElementById("theirD5");
let theirD6 = document.getElementById("theirD6");
let theirD7 = document.getElementById("theirD7");
let theirD8 = document.getElementById("theirD8");
let theirD9 = document.getElementById("theirD9");
let theirD10 = document.getElementById("theirD10");

let theirE1 = document.getElementById("theirE1");
let theirE2 = document.getElementById("theirE2");
let theirE3 = document.getElementById("theirE3");
let theirE4 = document.getElementById("theirE4");
let theirE5 = document.getElementById("theirE5");
let theirE6 = document.getElementById("theirE6");
let theirE7 = document.getElementById("theirE7");
let theirE8 = document.getElementById("theirE8");
let theirE9 = document.getElementById("theirE9");
let theirE10 = document.getElementById("theirE10");

let theirF1 = document.getElementById("theirF1");
let theirF2 = document.getElementById("theirF2");
let theirF3 = document.getElementById("theirF3");
let theirF4 = document.getElementById("theirF4");
let theirF5 = document.getElementById("theirF5");
let theirF6 = document.getElementById("theirF6");
let theirF7 = document.getElementById("theirF7");
let theirF8 = document.getElementById("theirF8");
let theirF9 = document.getElementById("theirF9");
let theirF10 = document.getElementById("theirF10");

let theirG1 = document.getElementById("theirG1");
let theirG2 = document.getElementById("theirG2");
let theirG3 = document.getElementById("theirG3");
let theirG4 = document.getElementById("theirG4");
let theirG5 = document.getElementById("theirG5");
let theirG6 = document.getElementById("theirG6");
let theirG7 = document.getElementById("theirG7");
let theirG8 = document.getElementById("theirG8");
let theirG9 = document.getElementById("theirG9");
let theirG10 = document.getElementById("theirG10");

let theirH1 = document.getElementById("theirH1");
let theirH2 = document.getElementById("theirH2");
let theirH3 = document.getElementById("theirH3");
let theirH4 = document.getElementById("theirH4");
let theirH5 = document.getElementById("theirH5");
let theirH6 = document.getElementById("theirH6");
let theirH7 = document.getElementById("theirH7");
let theirH8 = document.getElementById("theirH8");
let theirH9 = document.getElementById("theirH9");
let theirH10 = document.getElementById("theirH10");

let theirI1 = document.getElementById("theirI1");
let theirI2 = document.getElementById("theirI2");
let theirI3 = document.getElementById("theirI3");
let theirI4 = document.getElementById("theirI4");
let theirI5 = document.getElementById("theirI5");
let theirI6 = document.getElementById("theirI6");
let theirI7 = document.getElementById("theirI7");
let theirI8 = document.getElementById("theirI8");
let theirI9 = document.getElementById("theirI9");
let theirI10 = document.getElementById("theirI10");

let theirJ1 = document.getElementById("theirJ1");
let theirJ2 = document.getElementById("theirJ2");
let theirJ3 = document.getElementById("theirJ3");
let theirJ4 = document.getElementById("theirJ4");
let theirJ5 = document.getElementById("theirJ5");
let theirJ6 = document.getElementById("theirJ6");
let theirJ7 = document.getElementById("theirJ7");
let theirJ8 = document.getElementById("theirJ8");
let theirJ9 = document.getElementById("theirJ9");
let theirJ10 = document.getElementById("theirJ10");

function generateEnemyMap(){
    // set the five ships up
    // lets start with the big ship
    chooseEnemyLongShipLocation()
    chooseEnemyFourShipLocation()
    chooseEnemyThreeShipLocation()
    chooseEnemyThreeShipLocation()
    chooseEnemyTwoShipLocation()
  
}

function chooseEnemyTwoShipLocation(){
    // getting a random start point for the random grid generator
    let start ;
    let randint ;
    let TwoShipFirst = start;
    let TwoShipSecond ;
    
    let orient;
    let clearPath = false
   while(clearPath == false){

    start = chooseRandomGridPoint();
    randint = Math.ceil(Math.random()*2);

    if(randint == 1){
        orient = `vertical`
    }
    else{
        orient = `horizontal`
    }

    if(orient == `vertical`){
        while(start.slice(0,1)==`J`){
            start = chooseRandomGridPoint();
        }
        TwoShipFirst = start;
        if(start.slice(0,1)==`A`){
            TwoShipSecond = `B${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`B`){
            TwoShipSecond = `C${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`C`){
            TwoShipSecond = `D${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`D`){
            TwoShipSecond = `E${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`E`){
            TwoShipSecond = `F${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`F`){
            TwoShipSecond = `G${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`G`){
            TwoShipSecond = `H${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`H`){
            TwoShipSecond = `I${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`I`){
            TwoShipSecond = `J${parseInt(start.slice(1,start.length))}`
        }
    }
    else if(orient == `horizontal`){
        while(start.slice(1,start.length)==`1`){
            start = chooseRandomGridPoint();
        }
        TwoShipFirst = start;
        TwoShipSecond = `${start.slice(0,1)}${parseInt(start.slice(1,start.length))-1}`
        
    }
    TwoShipFirst=`their${TwoShipFirst}`
    TwoShipSecond=`their${TwoShipSecond}`


    
    console.log(document.getElementById(TwoShipFirst).attributes[2].value)
    console.log(document.getElementById(TwoShipSecond).attributes[2].value)
    
    if(`${document.getElementById(TwoShipFirst).attributes[2].value}` == `true`){
        
    }
    else if(`${document.getElementById(TwoShipSecond).attributes[2].value}` == `true`){
        
    }
    else{
        clearPath = true
    }

}

    document.getElementById(TwoShipFirst).setAttribute(`shiphere`, true)
    document.getElementById(TwoShipSecond).setAttribute(`shiphere`, true)

    //document.getElementById(TwoShipFirst).style.backgroundColor = `purple`;
    //document.getElementById(TwoShipSecond).style.backgroundColor = `purple`;
    
    document.getElementById(TwoShipFirst).setAttribute(`shiptype`, `destroyer`)
    document.getElementById(TwoShipSecond).setAttribute(`shiptype`, `destroyer`)

    console.log(orient)
    
}

function chooseEnemyThreeShipLocation(){
    // getting a random start point for the random grid generator
    let start ;
    let randint ;
    let ThreeShipFirst = start;
    let ThreeShipSecond ;
    let ThreeShipThird ;
    
    let orient;
    let clearPath = false
   while(clearPath == false){

    start = chooseRandomGridPoint();
    randint = Math.ceil(Math.random()*2);

    if(randint == 1){
        orient = `vertical`
    }
    else{
        orient = `horizontal`
    }

    if(orient == `vertical`){
        while(start.slice(0,1)==`I` || start.slice(0,1)==`J`){
            start = chooseRandomGridPoint();
        }
        ThreeShipFirst = start;
        if(start.slice(0,1)==`A`){
            ThreeShipSecond = `B${parseInt(start.slice(1,start.length))}`
            ThreeShipThird = `C${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`B`){
            ThreeShipSecond = `C${parseInt(start.slice(1,start.length))}`
            ThreeShipThird = `D${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`C`){
            ThreeShipSecond = `D${parseInt(start.slice(1,start.length))}`
            ThreeShipThird = `E${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`D`){
            ThreeShipSecond = `E${parseInt(start.slice(1,start.length))}`
            ThreeShipThird = `F${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`E`){
            ThreeShipSecond = `F${parseInt(start.slice(1,start.length))}`
            ThreeShipThird = `G${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`F`){
            ThreeShipSecond = `G${parseInt(start.slice(1,start.length))}`
            ThreeShipThird = `H${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`G`){
            ThreeShipSecond = `H${parseInt(start.slice(1,start.length))}`
            ThreeShipThird = `I${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`H`){
            ThreeShipSecond = `I${parseInt(start.slice(1,start.length))}`
            ThreeShipThird = `J${parseInt(start.slice(1,start.length))}`
        }
    }
    else if(orient == `horizontal`){
        while(start.slice(1,start.length)==`1` || start.slice(1,start.length)==`2`){
            start = chooseRandomGridPoint();
        }
        ThreeShipFirst = start;
        ThreeShipSecond = `${start.slice(0,1)}${parseInt(start.slice(1,start.length))-1}`
        ThreeShipThird = `${start.slice(0,1)}${parseInt(start.slice(1,start.length))-2}`
        
    }
    ThreeShipFirst=`their${ThreeShipFirst}`
    ThreeShipSecond=`their${ThreeShipSecond}`
    ThreeShipThird=`their${ThreeShipThird}`


    
    console.log(document.getElementById(ThreeShipFirst).attributes[2].value)
    console.log(document.getElementById(ThreeShipSecond).attributes[2].value)
    console.log(document.getElementById(ThreeShipThird).attributes[2].value)
    
    if(`${document.getElementById(ThreeShipFirst).attributes[2].value}` == `true`){
        
    }
    else if(`${document.getElementById(ThreeShipSecond).attributes[2].value}` == `true`){
        
    }
    else if(`${document.getElementById(ThreeShipThird).attributes[2].value}` == `true`){
        
    }
    else{
        clearPath = true
    }

}

    document.getElementById(ThreeShipFirst).setAttribute(`shiphere`, true)
    document.getElementById(ThreeShipSecond).setAttribute(`shiphere`, true)
    document.getElementById(ThreeShipThird).setAttribute(`shiphere`, true)
    if(shipcounter == 0){
    //document.getElementById(ThreeShipFirst).style.backgroundColor = `yellow`;
    //document.getElementById(ThreeShipSecond).style.backgroundColor = `yellow`;
    //document.getElementById(ThreeShipThird).style.backgroundColor = `yellow`;

    document.getElementById(ThreeShipFirst).setAttribute(`shiptype`, `cruiser`)
    document.getElementById(ThreeShipSecond).setAttribute(`shiptype`, `cruiser`)
    document.getElementById(ThreeShipThird).setAttribute(`shiptype`, `cruiser`)
    shipcounter =1
    }
    else{
        //document.getElementById(ThreeShipFirst).style.backgroundColor = `green`;
        //document.getElementById(ThreeShipSecond).style.backgroundColor = `green`;
        //document.getElementById(ThreeShipThird).style.backgroundColor = `green`;

        document.getElementById(ThreeShipFirst).setAttribute(`shiptype`, `stealth`)
        document.getElementById(ThreeShipSecond).setAttribute(`shiptype`, `stealth`)
        document.getElementById(ThreeShipThird).setAttribute(`shiptype`, `stealth`)
    }


    console.log(orient)
    
}

function chooseEnemyFourShipLocation(){
    // getting a random start point for the random grid generator
    let start ;
    let randint ;
    let FourShipFirst = start;
    let FourShipSecond ;
    let FourShipThird ;
    let FourShipFourth ;
    
    let orient;
    let clearPath = false
   while(clearPath == false){

    start = chooseRandomGridPoint();
    randint = Math.ceil(Math.random()*2);

    if(randint == 1){
        orient = `vertical`
    }
    else{
        orient = `horizontal`
    }

    if(orient == `vertical`){
        while(start.slice(0,1)==`H` || start.slice(0,1)==`I` || start.slice(0,1)==`J`){
            start = chooseRandomGridPoint();
        }
        FourShipFirst = start;
        if(start.slice(0,1)==`A`){
            FourShipSecond = `B${parseInt(start.slice(1,start.length))}`
            FourShipThird = `C${parseInt(start.slice(1,start.length))}`
            FourShipFourth = `D${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`B`){
            FourShipSecond = `C${parseInt(start.slice(1,start.length))}`
            FourShipThird = `D${parseInt(start.slice(1,start.length))}`
            FourShipFourth = `E${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`C`){
            FourShipSecond = `D${parseInt(start.slice(1,start.length))}`
            FourShipThird = `E${parseInt(start.slice(1,start.length))}`
            FourShipFourth = `F${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`D`){
            FourShipSecond = `E${parseInt(start.slice(1,start.length))}`
            FourShipThird = `F${parseInt(start.slice(1,start.length))}`
            FourShipFourth = `G${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`E`){
            FourShipSecond = `F${parseInt(start.slice(1,start.length))}`
            FourShipThird = `G${parseInt(start.slice(1,start.length))}`
            FourShipFourth = `H${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`F`){
            FourShipSecond = `G${parseInt(start.slice(1,start.length))}`
            FourShipThird = `H${parseInt(start.slice(1,start.length))}`
            FourShipFourth = `I${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`G`){
            FourShipSecond = `H${parseInt(start.slice(1,start.length))}`
            FourShipThird = `I${parseInt(start.slice(1,start.length))}`
            FourShipFourth = `J${parseInt(start.slice(1,start.length))}`
        }
    }
    else if(orient == `horizontal`){
        while(start.slice(1,start.length)==`1` || start.slice(1,start.length)==`2` || start.slice(1,start.length)==`3` ){
            start = chooseRandomGridPoint();
        }
        FourShipFirst = start;
        FourShipSecond = `${start.slice(0,1)}${parseInt(start.slice(1,start.length))-1}`
        FourShipThird = `${start.slice(0,1)}${parseInt(start.slice(1,start.length))-2}`
        FourShipFourth = `${start.slice(0,1)}${parseInt(start.slice(1,start.length))-3}`
        
    }
    FourShipFirst=`their${FourShipFirst}`
    FourShipSecond=`their${FourShipSecond}`
    FourShipThird=`their${FourShipThird}`
    FourShipFourth=`their${FourShipFourth}`


    
    console.log(document.getElementById(FourShipFirst).attributes[2].value)
    console.log(document.getElementById(FourShipSecond).attributes[2].value)
    console.log(document.getElementById(FourShipThird).attributes[2].value)
    console.log(document.getElementById(FourShipFourth).attributes[2].value)
    
    if(`${document.getElementById(FourShipFirst).attributes[2].value}` == `true`){
        
    }
    else if(`${document.getElementById(FourShipSecond).attributes[2].value}` == `true`){
        
    }
    else if(`${document.getElementById(FourShipThird).attributes[2].value}` == `true`){
        
    }
    else if(`${document.getElementById(FourShipFourth).attributes[2].value}` == `true`){
        
    }
    else{
        clearPath = true
    }

}

    document.getElementById(FourShipFirst).setAttribute(`shiphere`, true)
    document.getElementById(FourShipSecond).setAttribute(`shiphere`, true)
    document.getElementById(FourShipThird).setAttribute(`shiphere`, true)
    document.getElementById(FourShipFourth).setAttribute(`shiphere`, true)

    document.getElementById(FourShipFirst).setAttribute(`shiptype`, `battleship`)
    document.getElementById(FourShipSecond).setAttribute(`shiptype`, `battleship`)
    document.getElementById(FourShipThird).setAttribute(`shiptype`, `battleship`)
    document.getElementById(FourShipFourth).setAttribute(`shiptype`, `battleship`)

    //document.getElementById(FourShipFirst).style.backgroundColor = `blue`;
   // document.getElementById(FourShipSecond).style.backgroundColor = `blue`;
    //document.getElementById(FourShipThird).style.backgroundColor = `blue`;
    //document.getElementById(FourShipFourth).style.backgroundColor = `blue`;

    console.log(orient)
    
}

function chooseEnemyLongShipLocation(){
    // getting a random start point for the random grid generator
    let start = chooseRandomGridPoint();    
    let randint = Math.ceil(Math.random()*2);
    let orient;


    let bigShipFirst = start;
        let bigShipSecond ;
        let bigShipThird ;
        let bigShipFourth ;
        let bigShipFifth ;

    if(randint == 1){
        orient = `vertical`
    }
    else{
        orient = `horizontal`
    }

    if(orient == `vertical`){
        while(start.slice(0,1)==`G` || start.slice(0,1)==`H` || start.slice(0,1)==`I` || start.slice(0,1)==`J`){
            start = chooseRandomGridPoint();
        }
        bigShipFirst = start;
        if(start.slice(0,1)==`A`){
            bigShipSecond = `B${parseInt(start.slice(1,start.length))}`
            bigShipThird = `C${parseInt(start.slice(1,start.length))}`
            bigShipFourth = `D${parseInt(start.slice(1,start.length))}`
            bigShipFifth = `E${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`B`){
            bigShipSecond = `C${parseInt(start.slice(1,start.length))}`
            bigShipThird = `D${parseInt(start.slice(1,start.length))}`
            bigShipFourth = `E${parseInt(start.slice(1,start.length))}`
            bigShipFifth = `F${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`C`){
            bigShipSecond = `D${parseInt(start.slice(1,start.length))}`
            bigShipThird = `E${parseInt(start.slice(1,start.length))}`
            bigShipFourth = `F${parseInt(start.slice(1,start.length))}`
            bigShipFifth = `G${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`D`){
            bigShipSecond = `E${parseInt(start.slice(1,start.length))}`
            bigShipThird = `F${parseInt(start.slice(1,start.length))}`
            bigShipFourth = `G${parseInt(start.slice(1,start.length))}`
            bigShipFifth = `H${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`E`){
            bigShipSecond = `F${parseInt(start.slice(1,start.length))}`
            bigShipThird = `G${parseInt(start.slice(1,start.length))}`
            bigShipFourth = `H${parseInt(start.slice(1,start.length))}`
            bigShipFifth = `I${parseInt(start.slice(1,start.length))}`
        }
        else if(start.slice(0,1)==`F`){
            bigShipSecond = `G${parseInt(start.slice(1,start.length))}`
            bigShipThird = `H${parseInt(start.slice(1,start.length))}`
            bigShipFourth = `I${parseInt(start.slice(1,start.length))}`
            bigShipFifth = `J${parseInt(start.slice(1,start.length))}`
        }
 

    }
    else if(orient == `horizontal`){
        while(start.slice(1,start.length)==`1` || start.slice(1,start.length)==`2` || start.slice(1,start.length)==`3` || start.slice(1,start.length)==`4`){
            start = chooseRandomGridPoint();
        }
        bigShipFirst = start;
        bigShipSecond = `${start.slice(0,1)}${parseInt(start.slice(1,start.length))-1}`
        bigShipThird = `${start.slice(0,1)}${parseInt(start.slice(1,start.length))-2}`
        bigShipFourth = `${start.slice(0,1)}${parseInt(start.slice(1,start.length))-3}`
        bigShipFifth = `${start.slice(0,1)}${parseInt(start.slice(1,start.length))-4}`
        


    }
    bigShipFirst=`their${bigShipFirst}`
    bigShipSecond=`their${bigShipSecond}`
    bigShipThird=`their${bigShipThird}`
    bigShipFourth=`their${bigShipFourth}`
    bigShipFifth=`their${bigShipFifth}`
    document.getElementById(bigShipFirst).setAttribute(`shiphere`, true)
    document.getElementById(bigShipSecond).setAttribute(`shiphere`, true)
    document.getElementById(bigShipThird).setAttribute(`shiphere`, true)
    document.getElementById(bigShipFourth).setAttribute(`shiphere`, true)
    document.getElementById(bigShipFifth).setAttribute(`shiphere`, true)
    
    document.getElementById(bigShipFirst).setAttribute(`shiptype`, `carrier`)
    document.getElementById(bigShipSecond).setAttribute(`shiptype`, `carrier`)
    document.getElementById(bigShipThird).setAttribute(`shiptype`, `carrier`)
    document.getElementById(bigShipFourth).setAttribute(`shiptype`, `carrier`)
    document.getElementById(bigShipFifth).setAttribute(`shiptype`, `carrier`)

    //document.getElementById(bigShipFirst).style.backgroundColor = `aqua`;
    //document.getElementById(bigShipSecond).style.backgroundColor = `aqua`;
    //document.getElementById(bigShipThird).style.backgroundColor = `aqua`;
    //document.getElementById(bigShipFourth).style.backgroundColor = `aqua`;
    //document.getElementById(bigShipFifth).style.backgroundColor = `aqua`;

}

function chooseRandomGridPoint(){
    let randNum = Math.ceil(Math.random()*10);
    let randLetter = Math.ceil(Math.random()*10);
    if(randLetter==1){randLetter=`A`}
    else if(randLetter==2){randLetter=`B`}
    else if(randLetter==3){randLetter=`C`}
    else if(randLetter==4){randLetter=`D`}
    else if(randLetter==5){randLetter=`E`}
    else if(randLetter==6){randLetter=`F`}
    else if(randLetter==7){randLetter=`G`}
    else if(randLetter==8){randLetter=`H`}
    else if(randLetter==9){randLetter=`I`}
    else if(randLetter==10){randLetter=`J`}
    return `${randLetter}${randNum}`
}

let longShipFinalPositions=[];
let fourlongShipFinalPositions=[];
let threelong1ShipFinalPositions=[];
let threelong2ShipFinalPositions=[];
let twolongShipFinalPositions=[];

function findShipsOnceTheyAreStarted(){

    let ourShipList = 
    [
     ourA1, ourA2, ourA3, ourA4, ourA5,
     ourA6, ourA7, ourA8, ourA9,ourA10,
     ourB1, ourB2, ourB3, ourB4, ourB5,
     ourB6, ourB7, ourB8, ourB9, ourB10, 
     ourC1, ourC2, ourC3, ourC4, ourC5, 
     ourC6, ourC7, ourC8, ourC9, ourC10, 
     ourD1, ourD2, ourD3, ourD4, ourD5, 
     ourD6, ourD7, ourD8, ourD9, ourD10, 
     ourE1, ourE2, ourE3, ourE4, ourE5, 
     ourE6, ourE7, ourE8, ourE9, ourE10, 
     ourF1, ourF2, ourF3, ourF4, ourF5, 
     ourF6, ourF7, ourF8, ourF9, ourF10,
     ourG1, ourG2, ourG3, ourG4, ourG5, 
     ourG6, ourG7, ourG8, ourG9, ourG10, 
     ourH1, ourH2, ourH3, ourH4, ourH5, 
     ourH6, ourH7, ourH8, ourH9, ourH10,
     ourI1, ourI2, ourI3, ourI4, ourI5, 
     ourI6, ourI7, ourI8, ourI9, ourI10, 
     ourJ1, ourJ2, ourJ3, ourJ4, ourJ5, 
     ourJ6, ourJ7, ourJ8, ourJ9, ourJ10
    ]
    let shipCenters =[]
    for(let spot in ourShipList){
        if(ourShipList[spot].hasChildNodes()){
            shipCenters.push(ourShipList[spot].childNodes[0])
        }
    }
    let longShip1;
    let longShip2;
    let longShip3;
    let longShip4;
    let longShip5;

    let fourlongShip1;
    let fourlongShip2;
    let fourlongShip3;
    let fourlongShip4;

    let threelongShip1;
    let threelongShip2;
    let threelongShip3;

    let three2longShip1;
    let three2longShip2;
    let three2longShip3;

    let twolongship1;
    let twolongship2;
 
    
    for(let shipps in shipCenters){
        let imgsrc = shipCenters[shipps].attributes.src.nodeValue
        let orientation = shipCenters[shipps].attributes.shiporientation.value
        if(imgsrc==`space_carrier.png`){
            if(orientation == `vertical`){
                longShip3 =shipCenters[shipps].parentNode.id
                if(longShip3.slice(0,1)==`C`){
                    longShip1=`A${longShip3.slice(1,longShip3.length)}`
                    longShip2=`B${longShip3.slice(1,longShip3.length)}`
                    longShip4=`D${longShip3.slice(1,longShip3.length)}`
                    longShip5=`E${longShip3.slice(1,longShip3.length)}`
                }
                if(longShip3.slice(0,1)==`D`){
                    longShip1=`B${longShip3.slice(1,longShip3.length)}`
                    longShip2=`C${longShip3.slice(1,longShip3.length)}`
                    longShip4=`E${longShip3.slice(1,longShip3.length)}`
                    longShip5=`F${longShip3.slice(1,longShip3.length)}`
                }
                if(longShip3.slice(0,1)==`E`){
                    longShip1=`C${longShip3.slice(1,longShip3.length)}`
                    longShip2=`D${longShip3.slice(1,longShip3.length)}`
                    longShip4=`F${longShip3.slice(1,longShip3.length)}`
                    longShip5=`G${longShip3.slice(1,longShip3.length)}`
                }
                if(longShip3.slice(0,1)==`F`){
                    longShip1=`D${longShip3.slice(1,longShip3.length)}`
                    longShip2=`E${longShip3.slice(1,longShip3.length)}`
                    longShip4=`G${longShip3.slice(1,longShip3.length)}`
                    longShip5=`H${longShip3.slice(1,longShip3.length)}`
                }
                if(longShip3.slice(0,1)==`G`){
                    longShip1=`E${longShip3.slice(1,longShip3.length)}`
                    longShip2=`F${longShip3.slice(1,longShip3.length)}`
                    longShip4=`H${longShip3.slice(1,longShip3.length)}`
                    longShip5=`I${longShip3.slice(1,longShip3.length)}`
                }
                if(longShip3.slice(0,1)==`H`){
                    longShip1=`F${longShip3.slice(1,longShip3.length)}`
                    longShip2=`G${longShip3.slice(1,longShip3.length)}`
                    longShip4=`I${longShip3.slice(1,longShip3.length)}`
                    longShip5=`J${longShip3.slice(1,longShip3.length)}`
                }
            }
            else if(orientation == `horizontal`){
                longShip1 = `${shipCenters[shipps].parentNode.id.slice(0,1)}${parseInt(shipCenters[shipps].parentNode.id.slice(1,shipCenters[shipps].parentNode.id.length))+2}`
                longShip2 = `${shipCenters[shipps].parentNode.id.slice(0,1)}${parseInt(shipCenters[shipps].parentNode.id.slice(1,shipCenters[shipps].parentNode.id.length))+1}`
                longShip3 = `${shipCenters[shipps].parentNode.id}`
                longShip4 = `${shipCenters[shipps].parentNode.id.slice(0,1)}${parseInt(shipCenters[shipps].parentNode.id.slice(1,shipCenters[shipps].parentNode.id.length))-1}`
                longShip5 = `${shipCenters[shipps].parentNode.id.slice(0,1)}${parseInt(shipCenters[shipps].parentNode.id.slice(1,shipCenters[shipps].parentNode.id.length))-2}`
                
            }
            longShipFinalPositions.push(longShip1)
            longShipFinalPositions.push(longShip2)
            longShipFinalPositions.push(longShip3)
            longShipFinalPositions.push(longShip4)
            longShipFinalPositions.push(longShip5)
        }
        if(imgsrc==`Spaceship_tut_thin.png`){
            if(orientation == `vertical`){
                fourlongShip3 =shipCenters[shipps].parentNode.id
                if(fourlongShip3.slice(0,1)==`C`){
                    fourlongShip1=`A${fourlongShip3.slice(1,fourlongShip3.length)}`
                    fourlongShip2=`B${fourlongShip3.slice(1,fourlongShip3.length)}`
                    fourlongShip4=`D${fourlongShip3.slice(1,fourlongShip3.length)}`
                }
                if(fourlongShip3.slice(0,1)==`D`){
                    fourlongShip1=`B${fourlongShip3.slice(1,fourlongShip3.length)}`
                    fourlongShip2=`C${fourlongShip3.slice(1,fourlongShip3.length)}`
                    fourlongShip4=`E${fourlongShip3.slice(1,fourlongShip3.length)}`
                }
                if(fourlongShip3.slice(0,1)==`E`){
                    fourlongShip1=`C${fourlongShip3.slice(1,fourlongShip3.length)}`
                    fourlongShip2=`D${fourlongShip3.slice(1,fourlongShip3.length)}`
                    fourlongShip4=`F${fourlongShip3.slice(1,fourlongShip3.length)}`
                }
                if(fourlongShip3.slice(0,1)==`F`){
                    fourlongShip1=`D${fourlongShip3.slice(1,fourlongShip3.length)}`
                    fourlongShip2=`E${fourlongShip3.slice(1,fourlongShip3.length)}`
                    fourlongShip4=`G${fourlongShip3.slice(1,fourlongShip3.length)}`
                }
                if(fourlongShip3.slice(0,1)==`G`){
                    fourlongShip1=`E${fourlongShip3.slice(1,fourlongShip3.length)}`
                    fourlongShip2=`F${fourlongShip3.slice(1,fourlongShip3.length)}`
                    fourlongShip4=`H${fourlongShip3.slice(1,fourlongShip3.length)}`
                }
                if(fourlongShip3.slice(0,1)==`H`){
                    fourlongShip1=`F${fourlongShip3.slice(1,fourlongShip3.length)}`
                    fourlongShip2=`G${fourlongShip3.slice(1,fourlongShip3.length)}`
                    fourlongShip4=`I${fourlongShip3.slice(1,fourlongShip3.length)}`
                }
                if(fourlongShip3.slice(0,1)==`I`){
                    fourlongShip1=`G${fourlongShip3.slice(1,fourlongShip3.length)}`
                    fourlongShip2=`H${fourlongShip3.slice(1,fourlongShip3.length)}`
                    fourlongShip4=`J${fourlongShip3.slice(1,fourlongShip3.length)}`
                }
            }
            else if(orientation == `horizontal`){
                fourlongShip1 = `${shipCenters[shipps].parentNode.id.slice(0,1)}${parseInt(shipCenters[shipps].parentNode.id.slice(1,shipCenters[shipps].parentNode.id.length))+2}`
                fourlongShip2 = `${shipCenters[shipps].parentNode.id.slice(0,1)}${parseInt(shipCenters[shipps].parentNode.id.slice(1,shipCenters[shipps].parentNode.id.length))+1}`
                fourlongShip3 = `${shipCenters[shipps].parentNode.id}`
                fourlongShip4 = `${shipCenters[shipps].parentNode.id.slice(0,1)}${parseInt(shipCenters[shipps].parentNode.id.slice(1,shipCenters[shipps].parentNode.id.length))-1}`
                
            }
            fourlongShipFinalPositions.push(fourlongShip1)
            fourlongShipFinalPositions.push(fourlongShip2)
            fourlongShipFinalPositions.push(fourlongShip3)
            fourlongShipFinalPositions.push(fourlongShip4)
        }
        if(imgsrc==`shiper_mix_02.png`){
            if(orientation == `vertical`){
                threelongShip2 =shipCenters[shipps].parentNode.id
                if(threelongShip2.slice(0,1)==`B`){
                    threelongShip1=`A${threelongShip2.slice(1,threelongShip2.length)}`
                    threelongShip3=`C${threelongShip2.slice(1,threelongShip2.length)}`
                }
                if(threelongShip2.slice(0,1)==`C`){
                    threelongShip1=`B${threelongShip2.slice(1,threelongShip2.length)}`
                    threelongShip3=`D${threelongShip2.slice(1,threelongShip2.length)}`
                }
                if(threelongShip2.slice(0,1)==`D`){
                    threelongShip1=`C${threelongShip2.slice(1,threelongShip2.length)}`
                    threelongShip3=`E${threelongShip2.slice(1,threelongShip2.length)}`
                }
                if(threelongShip2.slice(0,1)==`E`){
                    threelongShip1=`D${threelongShip2.slice(1,threelongShip2.length)}`
                    threelongShip3=`F${threelongShip2.slice(1,threelongShip2.length)}`
                }
                if(threelongShip2.slice(0,1)==`F`){
                    threelongShip1=`E${threelongShip2.slice(1,threelongShip2.length)}`
                    threelongShip3=`G${threelongShip2.slice(1,threelongShip2.length)}`
                }
                if(threelongShip2.slice(0,1)==`G`){
                    threelongShip1=`F${threelongShip2.slice(1,threelongShip2.length)}`
                    threelongShip3=`H${threelongShip2.slice(1,threelongShip2.length)}`
                }
                if(threelongShip2.slice(0,1)==`H`){
                    threelongShip1=`G${threelongShip2.slice(1,threelongShip2.length)}`
                    threelongShip3=`I${threelongShip2.slice(1,threelongShip2.length)}`
                }
                if(threelongShip2.slice(0,1)==`I`){
                    threelongShip1=`H${threelongShip2.slice(1,threelongShip2.length)}`
                    threelongShip3=`J${threelongShip2.slice(1,threelongShip2.length)}`
                }
            }
            else if(orientation == `horizontal`){
                threelongShip1 = `${shipCenters[shipps].parentNode.id.slice(0,1)}${parseInt(shipCenters[shipps].parentNode.id.slice(1,shipCenters[shipps].parentNode.id.length))+1}`
                threelongShip2 = `${shipCenters[shipps].parentNode.id}`
                threelongShip3 = `${shipCenters[shipps].parentNode.id.slice(0,1)}${parseInt(shipCenters[shipps].parentNode.id.slice(1,shipCenters[shipps].parentNode.id.length))-1}`
                
            }
            threelong1ShipFinalPositions.push(threelongShip1)
            threelong1ShipFinalPositions.push(threelongShip2)
            threelong1ShipFinalPositions.push(threelongShip3)
        }
        if(imgsrc==`ship9.png`){
            if(orientation == `vertical`){
                three2longShip2 =shipCenters[shipps].parentNode.id
                if(three2longShip2.slice(0,1)==`B`){
                    three2longShip1=`A${three2longShip2.slice(1,three2longShip2.length)}`
                    three2longShip3=`C${three2longShip2.slice(1,three2longShip2.length)}`
                }
                if(three2longShip2.slice(0,1)==`C`){
                    three2longShip1=`B${three2longShip2.slice(1,three2longShip2.length)}`
                    three2longShip3=`D${three2longShip2.slice(1,three2longShip2.length)}`
                }
                if(three2longShip2.slice(0,1)==`D`){
                    three2longShip1=`C${three2longShip2.slice(1,three2longShip2.length)}`
                    three2longShip3=`E${three2longShip2.slice(1,three2longShip2.length)}`
                }
                if(three2longShip2.slice(0,1)==`E`){
                    three2longShip1=`D${three2longShip2.slice(1,three2longShip2.length)}`
                    three2longShip3=`F${three2longShip2.slice(1,three2longShip2.length)}`
                }
                if(three2longShip2.slice(0,1)==`F`){
                    three2longShip1=`E${three2longShip2.slice(1,three2longShip2.length)}`
                    three2longShip3=`G${three2longShip2.slice(1,three2longShip2.length)}`
                }
                if(three2longShip2.slice(0,1)==`G`){
                    three2longShip1=`F${three2longShip2.slice(1,three2longShip2.length)}`
                    three2longShip3=`H${three2longShip2.slice(1,three2longShip2.length)}`
                }
                if(three2longShip2.slice(0,1)==`H`){
                    three2longShip1=`G${three2longShip2.slice(1,three2longShip2.length)}`
                    three2longShip3=`I${three2longShip2.slice(1,three2longShip2.length)}`
                }
                if(three2longShip2.slice(0,1)==`I`){
                    three2longShip1=`H${three2longShip2.slice(1,three2longShip2.length)}`
                    three2longShip3=`J${three2longShip2.slice(1,three2longShip2.length)}`
                }
            }
            else if(orientation == `horizontal`){
                three2longShip1 = `${shipCenters[shipps].parentNode.id.slice(0,1)}${parseInt(shipCenters[shipps].parentNode.id.slice(1,shipCenters[shipps].parentNode.id.length))+1}`
                three2longShip2 = `${shipCenters[shipps].parentNode.id}`
                three2longShip3 = `${shipCenters[shipps].parentNode.id.slice(0,1)}${parseInt(shipCenters[shipps].parentNode.id.slice(1,shipCenters[shipps].parentNode.id.length))-1}`
                
            }
            threelong2ShipFinalPositions.push(three2longShip1)
            threelong2ShipFinalPositions.push(three2longShip2)
            threelong2ShipFinalPositions.push(three2longShip3)
        }
        if(imgsrc==`antmaker.png`){
            if(orientation == `vertical`){
                twolongship1 =shipCenters[shipps].parentNode.id
                if(twolongship1.slice(0,1)==`A`){
                    twolongship2=`B${twolongship1.slice(1,twolongship1.length)}`
                }
                if(twolongship1.slice(0,1)==`B`){
                    twolongship2=`C${twolongship1.slice(1,twolongship1.length)}`
                }
                if(twolongship1.slice(0,1)==`C`){
                    twolongship2=`D${twolongship1.slice(1,twolongship1.length)}`
                }
                if(twolongship1.slice(0,1)==`D`){
                    twolongship2=`E${twolongship1.slice(1,twolongship1.length)}`
                }
                if(twolongship1.slice(0,1)==`E`){
                    twolongship2=`F${twolongship1.slice(1,twolongship1.length)}`
                }
                if(twolongship1.slice(0,1)==`F`){
                    twolongship2=`G${twolongship1.slice(1,twolongship1.length)}`
                }
                if(twolongship1.slice(0,1)==`G`){
                    twolongship2=`H${twolongship1.slice(1,twolongship1.length)}`
                }
                if(twolongship1.slice(0,1)==`H`){
                    twolongship2=`I${twolongship1.slice(1,twolongship1.length)}`
                }
                if(twolongship1.slice(0,1)==`I`){
                    twolongship2=`J${twolongship1.slice(1,twolongship1.length)}`
                }

     
            }
            else if(orientation == `horizontal`){
                twolongship1 = `${shipCenters[shipps].parentNode.id.slice(0,1)}${parseInt(shipCenters[shipps].parentNode.id.slice(1,shipCenters[shipps].parentNode.id.length))+1}`
                twolongship2 = `${shipCenters[shipps].parentNode.id}`
                
            }
            twolongShipFinalPositions.push(twolongship1)
            twolongShipFinalPositions.push(twolongship2)
        }

    }

    console.log(longShipFinalPositions)
    console.log(fourlongShipFinalPositions)
    console.log(threelong1ShipFinalPositions)
    console.log(threelong2ShipFinalPositions)
    console.log(twolongShipFinalPositions)
}
let longshipalive = true;
let fourlongshipalive = true;
let three1longshipalive = true;
let three2longshipalive = true;
let twolongshipalive = true;






function startGame(){

generateEnemyMap()
findShipsOnceTheyAreStarted()
smallShip.setAttribute(`draggable`, false)
bigShip.setAttribute(`draggable`, false)
fourLongShip.setAttribute(`draggable`, false)
threeShipOne.setAttribute(`draggable`, false)
threeShipTwo.setAttribute(`draggable`, false)

document.getElementById('startbutton').style.visibility = 'hidden';
document.getElementById('shipContainer').style.visibility = 'hidden';

function resetP(){
document.getElementById("message").innerHTML = ""
}
resetP()
var ivariable = 0;
var animatedText2 = 'The war has begun... the enemy ships have picked their positions.'; /* The text */
var speed = 40; /* The speed/duration of the effect in milliseconds */

function typeWriter2() {
    if(useTyperWriter == true){
  if (ivariable < animatedText2.length) {
    document.getElementById("message").innerHTML += animatedText2.charAt(ivariable);
    ivariable++;
    setTimeout(typeWriter2, speed);
  }
}
    else{
        document.getElementById("message").innerHTML = animatedText2;
    }
}
typeWriter2()


if(useTyperWriter == true){

setTimeout(resetP,4699);
}
else{
    setTimeout(resetP,1699);
}
let  xvariable = 0;
let animatedText3 = `Click on an enemy grid position to fire a missile!`
function typeWriter3() {
    if(useTyperWriter == true){
    
    if (xvariable < animatedText3.length) {
      document.getElementById("message").innerHTML += animatedText3.charAt(xvariable);
      xvariable=xvariable+1
      setTimeout(typeWriter3, 30);
    }
}
    else{
        document.getElementById("message").innerHTML = animatedText3;
    }
  }


if(useTyperWriter == true){

    setTimeout(typeWriter3,4700)
    }
    else{
        setTimeout(typeWriter3,1700);
    }


function missMessage(){
    resetP()
let  yvariable = 0;
let animatedText4 = `You missed!`
function typeWriter4() {
    if(useTyperWriter == true){

    
    if (yvariable < animatedText4.length) {
      document.getElementById("message").innerHTML += animatedText4.charAt(yvariable);
      yvariable=yvariable+1
      setTimeout(typeWriter4, 30);
    }
}
        else{
            document.getElementById("message").innerHTML = animatedText4;
        }
  }
typeWriter4()

}


function enemyMissMessage(){
    resetP()
let  dvariable = 0;
let animatedText7 = `They missed!`
function typeWriter4() {
    if(useTyperWriter == true){

    
    if (dvariable < animatedText7.length) {
      document.getElementById("message").innerHTML += animatedText7.charAt(dvariable);
      dvariable=dvariable+1
      setTimeout(typeWriter4, 30);
    }
}

    else{
        document.getElementById("message").innerHTML = animatedText7;
    }
  }
typeWriter4()
}

function hitMessage(){
    resetP()
let  zvariable = 0;
let animatedText5 = `You got a hit! Attack again!`
function typeWriter5() {
    if(useTyperWriter == true){
    
    if (zvariable < animatedText5.length) {
      document.getElementById("message").innerHTML += animatedText5.charAt(zvariable);
      zvariable=zvariable+1
      setTimeout(typeWriter5, 30);
    }
}
    else{
        document.getElementById("message").innerHTML = animatedText5;
    }
  }
typeWriter5()

}

function enemyHitMessage(){
    resetP()
let  zvariablez = 0;
let animatedText10 = `They got a hit!`
function typeWriter10() {
   
    if(useTyperWriter == true){

    if (zvariablez < animatedText10.length) {
      document.getElementById("message").innerHTML += animatedText10.charAt(zvariablez);
      zvariablez=zvariablez+1
      setTimeout(typeWriter10, 30);
    }}
        else{
            document.getElementById("message").innerHTML = animatedText10;
        }
  }
  typeWriter10()

}

function enemyMessage(){
    resetP()
let  wvariable = 0;
let animatedText6 = `Their turn to attack!`
function typeWriter6() {
    if(useTyperWriter == true){

    if (wvariable < animatedText6.length) {
      document.getElementById("message").innerHTML += animatedText6.charAt(wvariable);
      wvariable=wvariable+1
      setTimeout(typeWriter6, 30);
    }
}
    else{
        document.getElementById("message").innerHTML = animatedText6;
    }
  }
typeWriter6()

}


function yourTurnMessage(){
    resetP()
let  avariable = 0;
let animatedText9 = `Your turn!`
function typeWriter9() {
    if(useTyperWriter == true){

    if (avariable < animatedText9.length) {
      document.getElementById("message").innerHTML += animatedText9.charAt(avariable);
      avariable=avariable+1
      setTimeout(typeWriter9, 30);
    }
}
    else{
        document.getElementById("message").innerHTML = animatedText9;
    }
  }
  typeWriter9()

}


function isPointAlreadyHit(enemyChoice){
    let test = previousEnemyChoices.indexOf(`${enemyChoice}`)
    return test
}


function findPotentialTargets (enemyChoice){


    let hitPosition = enemyChoice.id

    let rightPosition;
    let leftPosition;
    let topPosition;
    let bottomPosition;

    if(hitPosition.slice(1,hitPosition.length)==`10`){
    }
    else{
    rightPosition = `${hitPosition.slice(0,1)}${parseInt(hitPosition.slice(1,hitPosition.length))+1}`
    }

    
    if(hitPosition.slice(1,hitPosition.length)==`1`){
    }
    else{
        leftPosition = `${hitPosition.slice(0,1)}${parseInt(hitPosition.slice(1,hitPosition.length))-1}`
    }

    if(hitPosition.slice(0,1)==`A`){
    }
    else{ 
        if(hitPosition.slice(0,1)==`B`){
            topPosition = `A${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`C`){
            topPosition = `B${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`D`){
            topPosition = `C${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`E`){
            topPosition = `D${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`F`){
            topPosition = `E${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`G`){
            topPosition = `F${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`H`){
            topPosition = `G${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`I`){
            topPosition = `H${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`J`){
            topPosition = `I${hitPosition.slice(1,hitPosition.length)}`
        }
    }

    if(hitPosition.slice(0,1)==`J`){
    }
    else{ 
        if(hitPosition.slice(0,1)==`A`){
            bottomPosition = `B${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`B`){
            bottomPosition = `C${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`C`){
            bottomPosition = `D${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`D`){
            bottomPosition = `E${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`E`){
            bottomPosition = `F${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`F`){
            bottomPosition = `G${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`G`){
            bottomPosition = `H${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`H`){
            bottomPosition = `I${hitPosition.slice(1,hitPosition.length)}`
        }
        if(hitPosition.slice(0,1)==`I`){
            bottomPosition = `J${hitPosition.slice(1,hitPosition.length)}`
        }
    }
    let preList =[]

    if(bottomPosition){
        if(isPointAlreadyHit(bottomPosition)==-1){
            preList.push(bottomPosition)
        }
    }
    if(topPosition){
        if(isPointAlreadyHit(topPosition)==-1){
            preList.push(topPosition)
        }
    }
    if(leftPosition){
        if(isPointAlreadyHit(leftPosition)==-1){
            preList.push(leftPosition)
        }
    }
    if(rightPosition){
        if(isPointAlreadyHit(rightPosition)==-1){
            preList.push(rightPosition)
        }
    }
    while(preList.length>0){
        let randoNum = Math.floor(Math.random()*preList.length)
        potentialTargets.push(preList[randoNum])
        preList.splice(randoNum, 1);
    }

    console.log(topPosition)
    console.log(rightPosition)
    console.log(bottomPosition)
    console.log(leftPosition)

}






let previousEnemyChoices =[]
// Once the computer hits a spot it will try a spot next to the 


//probablityMap[`A1`]



function updateProbMapOnMiss(missSpace){
    console.log(probablityMap[missSpace.id])
    probablityMap[missSpace.id] = 0
    let waveRight1 = `${missSpace.id.slice(0,1)}${parseInt(missSpace.id.slice(1,missSpace.length))+1}`
    let waveRight2 = `${missSpace.id.slice(0,1)}${parseInt(missSpace.id.slice(1,missSpace.length))+2}`
    let waveRight3 = `${missSpace.id.slice(0,1)}${parseInt(missSpace.id.slice(1,missSpace.length))+3}`
    let waveRight4 = `${missSpace.id.slice(0,1)}${parseInt(missSpace.id.slice(1,missSpace.length))+4}`
    let waveLeft1 = `${missSpace.id.slice(0,1)}${parseInt(missSpace.id.slice(1,missSpace.length))-1}`
    let waveLeft2 = `${missSpace.id.slice(0,1)}${parseInt(missSpace.id.slice(1,missSpace.length))-2}`
    let waveLeft3 = `${missSpace.id.slice(0,1)}${parseInt(missSpace.id.slice(1,missSpace.length))-3}`
    let waveLeft4 = `${missSpace.id.slice(0,1)}${parseInt(missSpace.id.slice(1,missSpace.length))-4}`
   
    
    
    let waveTop4;
    let waveTop3;
    let waveTop2;
    let waveTop1;
    
    let waveBottom1;
    let waveBottom2;
    let waveBottom3;
    let waveBottom4;

    if(missSpace.id.slice(0,1) == `A`){
        waveBottom1 = `B${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom2 = `C${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom3 = `D${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom4 = `E${missSpace.id.slice(1,missSpace.id.length)}`
    }
    else if(missSpace.id.slice(0,1) == `B`){
        waveTop1 = `A${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom1 = `C${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom2 = `D${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom3 = `E${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom4 = `F${missSpace.id.slice(1,missSpace.id.length)}`
    }
    else if(missSpace.id.slice(0,1) == `C`){
        waveTop2 = `A${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop1 = `B${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom1 = `D${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom2 = `E${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom3 = `F${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom4 = `G${missSpace.id.slice(1,missSpace.id.length)}`
    }
    else if(missSpace.id.slice(0,1) == `D`){
        waveTop3 = `A${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop2 = `B${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop1 = `C${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom1 = `E${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom2 = `F${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom3 = `G${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom4 = `H${missSpace.id.slice(1,missSpace.id.length)}`
    }
    else if(missSpace.id.slice(0,1) == `E`){
        waveTop4 = `A${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop3 = `B${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop2 = `C${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop1 = `D${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom1 = `F${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom2 = `G${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom3 = `H${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom4 = `I${missSpace.id.slice(1,missSpace.id.length)}`
    }
    else if(missSpace.id.slice(0,1) == `F`){
        waveTop4 = `B${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop3 = `C${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop2 = `D${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop1 = `E${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom1 = `G${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom2 = `H${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom3 = `I${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom4 = `J${missSpace.id.slice(1,missSpace.id.length)}`
    }
    else if(missSpace.id.slice(0,1) == `G`){
        waveTop4 = `C${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop3 = `D${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop2 = `E${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop1 = `F${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom1 = `H${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom2 = `I${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom3 = `J${missSpace.id.slice(1,missSpace.id.length)}`
    }
    else if(missSpace.id.slice(0,1) == `H`){
        waveTop4 = `D${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop3 = `E${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop2 = `F${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop1 = `G${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom1 = `I${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom2 = `J${missSpace.id.slice(1,missSpace.id.length)}`
    }
    else if(missSpace.id.slice(0,1) == `I`){
        waveTop4 = `E${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop3 = `F${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop2 = `G${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop1 = `H${missSpace.id.slice(1,missSpace.id.length)}`
        waveBottom1 = `J${missSpace.id.slice(1,missSpace.id.length)}`

    }
    else if(missSpace.id.slice(0,1) == `J`){
        waveTop4 = `F${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop3 = `G${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop2 = `H${missSpace.id.slice(1,missSpace.id.length)}`
        waveTop1 = `I${missSpace.id.slice(1,missSpace.id.length)}`
    }
    


    for(let letter in listOfLetters){
        let entry = listOfLetters[letter]
        if(entry == waveRight1 || entry == waveLeft1 || entry == waveTop1 || entry == waveBottom1){
            probablityMap[entry]= Math.round((probablityMap[entry]-(probablityMap[entry]*0.3075))* 100) / 100
        }
        else if(entry == waveRight2 || entry == waveLeft2 || entry == waveTop2 || entry == waveBottom2){
            probablityMap[entry]= Math.round((probablityMap[entry]-(probablityMap[entry]*0.176))* 100) / 100
        }
        else if(entry == waveRight3 || entry == waveLeft3 || entry == waveTop3 || entry == waveBottom3){
            probablityMap[entry]= Math.round((probablityMap[entry]-(probablityMap[entry]*0.065))* 100) / 100
        }
        else if(entry == waveRight4 || entry == waveLeft4 || entry == waveTop4 || entry == waveBottom4){
            probablityMap[entry]= Math.round((probablityMap[entry]+(probablityMap[entry]*0.0057))* 100) / 100
        }



        else{
        probablityMap[entry] =  Math.round((probablityMap[entry]+(probablityMap[entry]*0.038))* 10) / 10
        }

}}

function findMaxProbSpace(){
    for(let letter in listOfLetters){
    let entry = listOfLetters[letter]
    let prob = probablityMap[entry]
    if (prob > maxProb){
        maxProb = prob;
        maxProbSpace = entry;
    }
    }
console.log(`${maxProbSpace} : ${maxProb}`)
maxProb =0
return maxProbSpace
}

let potentialTargets =[]




function checkLongShipSunk(){

    let longshiphhitCounter=0;
    for(let position in longShipFinalPositions){
        if(document.getElementById(`${longShipFinalPositions[position]}`).attributes[5] != undefined){
            longshiphhitCounter++
        }
    }
    console.log(longshiphhitCounter)
    if(longshiphhitCounter == 5 && longshipalive == true){
        prompt(`They sunk your carrier!`)
        longshipalive = false;
        potentialTargets = []
        return true
    }
    else{
        return false
    }
}

function checkfourLongShipSunk(){

    let fourlongshiphhitCounter=0;
    for(let position in fourlongShipFinalPositions){
        if(document.getElementById(`${fourlongShipFinalPositions[position]}`).attributes[5] != undefined){
            fourlongshiphhitCounter++
        }
    }
    console.log(fourlongshiphhitCounter)
    if(fourlongshiphhitCounter == 4 && fourlongshipalive == true){
        prompt(`They sunk your BattleShip!`)
        fourlongshipalive = false;
        return true
    }
    else{
        return false
    }
}

function checkthree1LongShipSunk(){

    let three1longshiphhitCounter=0;
    for(let position in threelong1ShipFinalPositions){
        if(document.getElementById(`${threelong1ShipFinalPositions[position]}`).attributes[5] != undefined){
            three1longshiphhitCounter++
        }
    }
    console.log(three1longshiphhitCounter)
    if(three1longshiphhitCounter == 3 && three1longshipalive == true){
        prompt(`They sunk your BattleShip!`)
        three1longshipalive = false;
        return true
    }
    else{
        return false
    }
}

function checkthree2LongShipSunk(){

    let three2longshiphhitCounter=0;
    for(let position in threelong2ShipFinalPositions){
        if(document.getElementById(`${threelong2ShipFinalPositions[position]}`).attributes[5] != undefined){
            three2longshiphhitCounter++
        }
    }
    console.log(three2longshiphhitCounter)
    if(three2longshiphhitCounter == 3 && three2longshipalive == true){
        prompt(`They sunk your BattleShip!`)
        three2longshipalive = false;
        return true
    }
    else{
        return false
    }
}


function checktwo2LongShipSunk(){

    let twolongshiphhitCounter=0;
    for(let position in twolongShipFinalPositions){
        if(document.getElementById(`${twolongShipFinalPositions[position]}`).attributes[5] != undefined){
            twolongshiphhitCounter++
        }
    }
    console.log(twolongshiphhitCounter)
    if(twolongshiphhitCounter == 2 && twolongshipalive == true){
        prompt(`They sunk your BattleShip!`)
        twolongshipalive = false;
        return true
    }
    else{
        return false
    }
}





function enemyTurn(){


    let enemyChoice;
    if(potentialTargets.length>0){
        enemyChoice = potentialTargets.pop()
    }
    else{
        enemyChoice = findMaxProbSpace()
    }
    previousEnemyChoices.push(`${enemyChoice}`)
    
    enemyChoice = document.getElementById(`${enemyChoice}`)

    if(enemyChoice.attributes[4].value == `false`){
        enemyChoice.style.opacity = 0;
        enemyMissMessage();
        updateProbMapOnMiss(enemyChoice);
        setTimeout(yourTurnMessage,800)
        
    }
    else if(enemyChoice.attributes[4].value == `true`){

        // need to add all of the grid points around it, could write a function here

        findPotentialTargets(enemyChoice)
        probablityMap[enemyChoice.id] = 0
        enemyChoice.style.backgroundColor= `red`;
        enemyChoice.setAttribute(`shiptype`, `hit`)
        enemyHitMessage()

        if(checkLongShipSunk() == true){
            potentialTargets=[]
        }
        else if(checkfourLongShipSunk() == true){
            potentialTargets=[]
        }
        else if(checkthree1LongShipSunk() == true){
            potentialTargets=[]
        }
        else if(checkthree2LongShipSunk() == true){
            potentialTargets=[]
        }
        else if(checktwo2LongShipSunk() == true){
            potentialTargets=[]
        }

        checkFriendlyShips()
        setTimeout(enemyTurn,800)
    
    //checkEnemyShips()}
}
    
}








theirA1.addEventListener("click",ev=>{
    if(theirA1.attributes[2].value == `false`){
        theirA1.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirA1.attributes[2].value == `true`){
        hitMessage()
        theirA1.style.backgroundColor= `red`;
        theirA1.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()}

})
theirA2.addEventListener("click",ev=>{
    if(theirA2.attributes[2].value == `false`){
        theirA2.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirA2.attributes[2].value == `true`){
        hitMessage()
        theirA2.style.backgroundColor= `red`;
        theirA2.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})





theirA3.addEventListener("click",ev=>{
    if(theirA3.attributes[2].value == `false`){
        theirA3.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirA3.attributes[2].value == `true`){
        hitMessage()
        theirA3.style.backgroundColor= `red`;
        theirA3.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirA4.addEventListener("click",ev=>{
    if(theirA4.attributes[2].value == `false`){
        theirA4.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirA4.attributes[2].value == `true`){
        hitMessage()
        theirA4.style.backgroundColor= `red`;
        theirA4.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirA5.addEventListener("click",ev=>{
    if(theirA5.attributes[2].value == `false`){
        theirA5.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirA5.attributes[2].value == `true`){
        hitMessage()
        theirA5.style.backgroundColor= `red`;
        theirA5.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirA6.addEventListener("click",ev=>{
    if(theirA6.attributes[2].value == `false`){
        theirA6.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirA6.attributes[2].value == `true`){
        hitMessage()
        theirA6.style.backgroundColor= `red`;
        theirA6.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirA7.addEventListener("click",ev=>{
    if(theirA7.attributes[2].value == `false`){
        theirA7.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirA7.attributes[2].value == `true`){
        hitMessage()
        theirA7.style.backgroundColor= `red`;
        theirA7.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirA8.addEventListener("click",ev=>{
    if(theirA8.attributes[2].value == `false`){
        theirA8.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirA8.attributes[2].value == `true`){
        hitMessage()
        theirA8.style.backgroundColor= `red`;
        theirA8.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirA9.addEventListener("click",ev=>{
    if(theirA9.attributes[2].value == `false`){
        theirA9.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirA9.attributes[2].value == `true`){
        hitMessage()
        theirA9.style.backgroundColor= `red`;
        theirA9.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirA10.addEventListener("click",ev=>{
    if(theirA10.attributes[2].value == `false`){
        theirA10.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirA10.attributes[2].value == `true`){
        hitMessage()
        theirA10.style.backgroundColor= `red`;
        theirA10.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})

theirB1.addEventListener("click",ev=>{
    if(theirB1.attributes[2].value == `false`){
        theirB1.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirB1.attributes[2].value == `true`){
        hitMessage()
        theirB1.style.backgroundColor= `red`;
        theirB1.setAttribute(`shiptype`, `hit`)
     
    checkEnemyShips()
}
})
theirB2.addEventListener("click",ev=>{
    if(theirB2.attributes[2].value == `false`){
        theirB2.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirB2.attributes[2].value == `true`){
        hitMessage()
        theirB2.style.backgroundColor= `red`;
        theirB2.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirB3.addEventListener("click",ev=>{
    if(theirB3.attributes[2].value == `false`){
        theirB3.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirB3.attributes[2].value == `true`){
        hitMessage()
        theirB3.style.backgroundColor= `red`;
        theirB3.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirB4.addEventListener("click",ev=>{
    if(theirB4.attributes[2].value == `false`){
        theirB4.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirB4.attributes[2].value == `true`){
        hitMessage()
        theirB4.style.backgroundColor= `red`;
        theirB4.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirB5.addEventListener("click",ev=>{
    if(theirB5.attributes[2].value == `false`){
        theirB5.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirB5.attributes[2].value == `true`){
        hitMessage()
        theirB5.style.backgroundColor= `red`;
        theirB5.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirB6.addEventListener("click",ev=>{
    if(theirB6.attributes[2].value == `false`){
        theirB6.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirB6.attributes[2].value == `true`){
        hitMessage()
        theirB6.style.backgroundColor= `red`;
        theirB6.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirB7.addEventListener("click",ev=>{
    if(theirB7.attributes[2].value == `false`){
        theirB7.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirB7.attributes[2].value == `true`){
        hitMessage()
        theirB7.style.backgroundColor= `red`;
        theirB7.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirB8.addEventListener("click",ev=>{
    if(theirB8.attributes[2].value == `false`){
        theirB8.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirB8.attributes[2].value == `true`){
        hitMessage()
        theirB8.style.backgroundColor= `red`;
        theirB8.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirB9.addEventListener("click",ev=>{
    if(theirB9.attributes[2].value == `false`){
        theirB9.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirB9.attributes[2].value == `true`){
        hitMessage()
        theirB9.style.backgroundColor= `red`;
        theirB9.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirB10.addEventListener("click",ev=>{
    if(theirB10.attributes[2].value == `false`){
        theirB10.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirB10.attributes[2].value == `true`){
        hitMessage()
        theirB10.style.backgroundColor= `red`;
        theirB10.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})


theirC1.addEventListener("click",ev=>{
    if(theirC1.attributes[2].value == `false`){
        theirC1.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirC1.attributes[2].value == `true`){
        hitMessage()
        theirC1.style.backgroundColor= `red`;
        theirC1.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirC2.addEventListener("click",ev=>{
    if(theirC2.attributes[2].value == `false`){
        theirC2.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirC2.attributes[2].value == `true`){
        hitMessage()
        theirC2.style.backgroundColor= `red`;
        theirC2.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirC3.addEventListener("click",ev=>{
    if(theirC3.attributes[2].value == `false`){
        theirC3.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirC3.attributes[2].value == `true`){
        hitMessage()
        theirC3.style.backgroundColor= `red`;
        theirC3.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirC4.addEventListener("click",ev=>{
    if(theirC4.attributes[2].value == `false`){
        theirC4.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirC4.attributes[2].value == `true`){
        hitMessage()
        theirC4.style.backgroundColor= `red`;
        theirC4.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirC5.addEventListener("click",ev=>{
    if(theirC5.attributes[2].value == `false`){
        theirC5.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirC5.attributes[2].value == `true`){
        hitMessage()
        theirC5.style.backgroundColor= `red`;
        theirC5.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirC6.addEventListener("click",ev=>{
    if(theirC6.attributes[2].value == `false`){
        theirC6.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirC6.attributes[2].value == `true`){
        hitMessage()
        theirC6.style.backgroundColor= `red`;
        theirC6.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirC7.addEventListener("click",ev=>{
    if(theirC7.attributes[2].value == `false`){
        theirC7.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirC7.attributes[2].value == `true`){
        hitMessage()
        theirC7.style.backgroundColor= `red`;
        theirC7.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirC8.addEventListener("click",ev=>{
    if(theirC8.attributes[2].value == `false`){
        theirC8.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirC8.attributes[2].value == `true`){
        hitMessage()
        theirC8.style.backgroundColor= `red`;
        theirC8.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirC9.addEventListener("click",ev=>{
    if(theirC9.attributes[2].value == `false`){
        theirC9.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirC9.attributes[2].value == `true`){
        hitMessage()
        theirC9.style.backgroundColor= `red`;
        theirC9.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirC10.addEventListener("click",ev=>{
    if(theirC10.attributes[2].value == `false`){
        theirC10.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirC10.attributes[2].value == `true`){
        hitMessage()
        theirC10.style.backgroundColor= `red`;
        theirC10.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})

theirD1.addEventListener("click",ev=>{
    if(theirD1.attributes[2].value == `false`){
        theirD1.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirD1.attributes[2].value == `true`){
        hitMessage()
        theirD1.style.backgroundColor= `red`;
        theirD1.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirD2.addEventListener("click",ev=>{
    if(theirD2.attributes[2].value == `false`){
        theirD2.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirD2.attributes[2].value == `true`){
        hitMessage()
        theirD2.style.backgroundColor= `red`;
        theirD2.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirD3.addEventListener("click",ev=>{
    if(theirD3.attributes[2].value == `false`){
        theirD3.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirD3.attributes[2].value == `true`){
        hitMessage()
        theirD3.style.backgroundColor= `red`;
        theirD3.setAttribute(`shiptype`, `hit`)
   
    checkEnemyShips()
}
})
theirD4.addEventListener("click",ev=>{
    if(theirD4.attributes[2].value == `false`){
        theirD4.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirD4.attributes[2].value == `true`){
        hitMessage()
        theirD4.style.backgroundColor= `red`;
        theirD4.setAttribute(`shiptype`, `hit`)
  
    checkEnemyShips()
}
})
theirD5.addEventListener("click",ev=>{
    if(theirD5.attributes[2].value == `false`){
        theirD5.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirD5.attributes[2].value == `true`){
        hitMessage()
        theirD5.style.backgroundColor= `red`;
        theirD5.setAttribute(`shiptype`, `hit`)
  
    checkEnemyShips()
}
})
theirD6.addEventListener("click",ev=>{
    if(theirD6.attributes[2].value == `false`){
        theirD6.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirD6.attributes[2].value == `true`){
        hitMessage()
        theirD6.style.backgroundColor= `red`;
        theirD6.setAttribute(`shiptype`, `hit`)
  
    checkEnemyShips()
}
})
theirD7.addEventListener("click",ev=>{
    if(theirD7.attributes[2].value == `false`){
        theirD7.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirD7.attributes[2].value == `true`){
        hitMessage()
        theirD7.style.backgroundColor= `red`;
        theirD7.setAttribute(`shiptype`, `hit`)
  
    checkEnemyShips()
}
})
theirD8.addEventListener("click",ev=>{
    if(theirD8.attributes[2].value == `false`){
        theirD8.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirD8.attributes[2].value == `true`){
        hitMessage()
        theirD8.style.backgroundColor= `red`;
        theirD8.setAttribute(`shiptype`, `hit`)
  
    checkEnemyShips()
}
})
theirD9.addEventListener("click",ev=>{
    if(theirD9.attributes[2].value == `false`){
        theirD9.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirD9.attributes[2].value == `true`){
        hitMessage()
        theirD9.style.backgroundColor= `red`;
        theirD9.setAttribute(`shiptype`, `hit`)
  
    checkEnemyShips()
}
})
theirD10.addEventListener("click",ev=>{
    if(theirD10.attributes[2].value == `false`){
        theirD10.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirD10.attributes[2].value == `true`){
        hitMessage()
        theirD10.style.backgroundColor= `red`;
        theirD10.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})

theirE1.addEventListener("click",ev=>{
    if(theirE1.attributes[2].value == `false`){
        theirE1.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirE1.attributes[2].value == `true`){
        hitMessage()
        theirE1.style.backgroundColor= `red`;
        theirE1.setAttribute(`shiptype`, `hit`)
  
    checkEnemyShips()
}
})
theirE2.addEventListener("click",ev=>{
    if(theirE2.attributes[2].value == `false`){
        theirE2.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirE2.attributes[2].value == `true`){
        hitMessage()
        theirE2.style.backgroundColor= `red`;
        theirE2.setAttribute(`shiptype`, `hit`)
  
    checkEnemyShips()
}
})
theirE3.addEventListener("click",ev=>{
    if(theirE3.attributes[2].value == `false`){
        theirE3.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirE3.attributes[2].value == `true`){
        hitMessage()
        theirE3.style.backgroundColor= `red`;
        theirE3.setAttribute(`shiptype`, `hit`)
 
    checkEnemyShips()
}
})
theirE4.addEventListener("click",ev=>{
    if(theirE4.attributes[2].value == `false`){
        theirE4.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirE4.attributes[2].value == `true`){
        hitMessage()
        theirE4.style.backgroundColor= `red`;
        theirE4.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirE5.addEventListener("click",ev=>{
    if(theirE5.attributes[2].value == `false`){
        theirE5.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirE5.attributes[2].value == `true`){
        hitMessage()
        theirE5.style.backgroundColor= `red`;
        theirE5.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirE6.addEventListener("click",ev=>{
    if(theirE6.attributes[2].value == `false`){
        theirE6.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirE6.attributes[2].value == `true`){
        hitMessage()
        theirE6.style.backgroundColor= `red`;
        theirE6.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirE7.addEventListener("click",ev=>{
    if(theirE7.attributes[2].value == `false`){
        theirE7.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirE7.attributes[2].value == `true`){
        hitMessage()
        theirE7.style.backgroundColor= `red`;
        theirE7.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirE8.addEventListener("click",ev=>{
    if(theirE8.attributes[2].value == `false`){
        theirE8.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirE8.attributes[2].value == `true`){
        hitMessage()
        theirE8.style.backgroundColor= `red`;
        theirE8.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirE9.addEventListener("click",ev=>{
    if(theirE9.attributes[2].value == `false`){
        theirE9.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirE9.attributes[2].value == `true`){
        hitMessage()
        theirE9.style.backgroundColor= `red`;
        theirE9.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirE10.addEventListener("click",ev=>{
    if(theirE10.attributes[2].value == `false`){
        theirE10.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirE10.attributes[2].value == `true`){
        hitMessage()
        theirE10.style.backgroundColor= `red`;
        theirE10.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})


theirF1.addEventListener("click",ev=>{
    if(theirF1.attributes[2].value == `false`){
        theirF1.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirF1.attributes[2].value == `true`){
        hitMessage()
        theirF1.style.backgroundColor= `red`;
        theirF1.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirF2.addEventListener("click",ev=>{
    if(theirF2.attributes[2].value == `false`){
        theirF2.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirF2.attributes[2].value == `true`){
        hitMessage()
        theirF2.style.backgroundColor= `red`;
        theirF2.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirF3.addEventListener("click",ev=>{
    if(theirF3.attributes[2].value == `false`){
        theirF3.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirF3.attributes[2].value == `true`){
        hitMessage()
        theirF3.style.backgroundColor= `red`;
        theirF3.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirF4.addEventListener("click",ev=>{
    if(theirF4.attributes[2].value == `false`){
        theirF4.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirF4.attributes[2].value == `true`){
        hitMessage()
        theirF4.style.backgroundColor= `red`;
        theirF4.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirF5.addEventListener("click",ev=>{
    if(theirF5.attributes[2].value == `false`){
        theirF5.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirF5.attributes[2].value == `true`){
        hitMessage()
        theirF5.style.backgroundColor= `red`;
        theirF5.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirF6.addEventListener("click",ev=>{
    if(theirF6.attributes[2].value == `false`){
        theirF6.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirF6.attributes[2].value == `true`){
        hitMessage()
        theirF6.style.backgroundColor= `red`;
        theirF6.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirF7.addEventListener("click",ev=>{
    if(theirF7.attributes[2].value == `false`){
        theirF7.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirF7.attributes[2].value == `true`){
        hitMessage()
        theirF7.style.backgroundColor= `red`;
        theirF7.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirF8.addEventListener("click",ev=>{
    if(theirF8.attributes[2].value == `false`){
        theirF8.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirF8.attributes[2].value == `true`){
        hitMessage()
        theirF8.style.backgroundColor= `red`;
        theirF8.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirF9.addEventListener("click",ev=>{
    if(theirF9.attributes[2].value == `false`){
        theirF9.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirF9.attributes[2].value == `true`){
        hitMessage()
        theirF9.style.backgroundColor= `red`;
        theirF9.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirF10.addEventListener("click",ev=>{
    if(theirF10.attributes[2].value == `false`){
        theirF10.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirF10.attributes[2].value == `true`){
        hitMessage()
        theirF10.style.backgroundColor= `red`;
        theirF10.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})

theirG1.addEventListener("click",ev=>{
    if(theirG1.attributes[2].value == `false`){
        theirG1.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirG1.attributes[2].value == `true`){
        hitMessage()
        theirG1.style.backgroundColor= `red`;
        theirG1.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirG2.addEventListener("click",ev=>{
    if(theirG2.attributes[2].value == `false`){
        theirG2.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirG2.attributes[2].value == `true`){
        hitMessage()
        theirG2.style.backgroundColor= `red`;
        theirG2.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirG3.addEventListener("click",ev=>{
    if(theirG3.attributes[2].value == `false`){
        theirG3.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirG3.attributes[2].value == `true`){
        hitMessage()
        theirG3.style.backgroundColor= `red`;
        theirG3.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirG4.addEventListener("click",ev=>{
    if(theirG4.attributes[2].value == `false`){
        theirG4.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirG4.attributes[2].value == `true`){
        hitMessage()
        theirG4.style.backgroundColor= `red`;
        theirG4.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirG5.addEventListener("click",ev=>{
    if(theirG5.attributes[2].value == `false`){
        theirG5.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirG5.attributes[2].value == `true`){
        hitMessage()
        theirG5.style.backgroundColor= `red`;
        theirG5.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirG6.addEventListener("click",ev=>{
    if(theirG6.attributes[2].value == `false`){
        theirG6.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirG6.attributes[2].value == `true`){
        hitMessage()
        theirG6.style.backgroundColor= `red`;
        theirG6.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirG7.addEventListener("click",ev=>{
    if(theirG7.attributes[2].value == `false`){
        theirG7.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirG7.attributes[2].value == `true`){
        hitMessage()
        theirG7.style.backgroundColor= `red`;
        theirG7.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirG8.addEventListener("click",ev=>{
    if(theirG8.attributes[2].value == `false`){
        theirG8.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirG8.attributes[2].value == `true`){
        hitMessage()
        theirG8.style.backgroundColor= `red`;
        theirG8.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirG9.addEventListener("click",ev=>{
    if(theirG9.attributes[2].value == `false`){
        theirG9.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirG9.attributes[2].value == `true`){
        hitMessage()
        theirG9.style.backgroundColor= `red`;
        theirG9.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirG10.addEventListener("click",ev=>{
    if(theirG10.attributes[2].value == `false`){
        theirG10.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirG10.attributes[2].value == `true`){
        hitMessage()
        theirG10.style.backgroundColor= `red`;
        theirG10.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})


theirH1.addEventListener("click",ev=>{
    if(theirH1.attributes[2].value == `false`){
        theirH1.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirH1.attributes[2].value == `true`){
        hitMessage()
        theirH1.style.backgroundColor= `red`;
        theirH1.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirH2.addEventListener("click",ev=>{
    if(theirH2.attributes[2].value == `false`){
        theirH2.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirH2.attributes[2].value == `true`){
        hitMessage()
        theirH2.style.backgroundColor= `red`;
        theirH2.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirH3.addEventListener("click",ev=>{
    if(theirH3.attributes[2].value == `false`){
        theirH3.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirH3.attributes[2].value == `true`){
        hitMessage()
        theirH3.style.backgroundColor= `red`;
        theirH3.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirH4.addEventListener("click",ev=>{
    if(theirH4.attributes[2].value == `false`){
        theirH4.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirH4.attributes[2].value == `true`){
        hitMessage()
        theirH4.style.backgroundColor= `red`;
        theirH4.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirH5.addEventListener("click",ev=>{
    if(theirH5.attributes[2].value == `false`){
        theirH5.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirH5.attributes[2].value == `true`){
        hitMessage()
        theirH5.style.backgroundColor= `red`;
        theirH5.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirH6.addEventListener("click",ev=>{
    if(theirH6.attributes[2].value == `false`){
        theirH6.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirH6.attributes[2].value == `true`){
        hitMessage()
        theirH6.style.backgroundColor= `red`;
        theirH6.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirH7.addEventListener("click",ev=>{
    if(theirH7.attributes[2].value == `false`){
        theirH7.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirH7.attributes[2].value == `true`){
        hitMessage()
        theirH7.style.backgroundColor= `red`;
        theirH7.setAttribute(`shiptype`, `hit`)
    checkEnemyShips()
}
})
theirH8.addEventListener("click",ev=>{
    if(theirH8.attributes[2].value == `false`){
        theirH8.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirH8.attributes[2].value == `true`){
        hitMessage()
        theirH8.style.backgroundColor= `red`;
        theirH8.setAttribute(`shiptype`, `hit`)
    checkEnemyShips()
}
})
theirH9.addEventListener("click",ev=>{
    if(theirH9.attributes[2].value == `false`){
        theirH9.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirH9.attributes[2].value == `true`){
        hitMessage()
        theirH9.style.backgroundColor= `red`;
        theirH9.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirH10.addEventListener("click",ev=>{
    if(theirH10.attributes[2].value == `false`){
        theirH10.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirH10.attributes[2].value == `true`){
        hitMessage()
        theirH10.style.backgroundColor= `red`;
        theirH10.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})


theirI1.addEventListener("click",ev=>{
    if(theirI1.attributes[2].value == `false`){
        theirI1.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirI1.attributes[2].value == `true`){
        hitMessage()
        theirI1.style.backgroundColor= `red`;
        theirI1.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirI2.addEventListener("click",ev=>{
    if(theirI2.attributes[2].value == `false`){
        theirI2.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirI2.attributes[2].value == `true`){
        hitMessage()
        theirI2.style.backgroundColor= `red`;
        theirI2.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirI3.addEventListener("click",ev=>{
    if(theirI3.attributes[2].value == `false`){
        theirI3.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirI3.attributes[2].value == `true`){
        hitMessage()
        theirI3.style.backgroundColor= `red`;
        theirI3.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirI4.addEventListener("click",ev=>{
    if(theirI4.attributes[2].value == `false`){
        theirI4.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirI4.attributes[2].value == `true`){
        hitMessage()
        theirI4.style.backgroundColor= `red`;
        theirI4.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirI5.addEventListener("click",ev=>{
    if(theirI5.attributes[2].value == `false`){
        theirI5.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirI5.attributes[2].value == `true`){
        hitMessage()
        theirI5.style.backgroundColor= `red`;
        theirI5.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirI6.addEventListener("click",ev=>{
    if(theirI6.attributes[2].value == `false`){
        theirI6.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirI6.attributes[2].value == `true`){
        hitMessage()
        theirI6.style.backgroundColor= `red`;
        theirI6.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirI7.addEventListener("click",ev=>{
    if(theirI7.attributes[2].value == `false`){
        theirI7.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirI7.attributes[2].value == `true`){
        hitMessage()
        theirI7.style.backgroundColor= `red`;
        theirI7.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirI8.addEventListener("click",ev=>{
    if(theirI8.attributes[2].value == `false`){
        theirI8.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirI8.attributes[2].value == `true`){
        hitMessage()
        theirI8.style.backgroundColor= `red`;
        theirI8.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirI9.addEventListener("click",ev=>{
    if(theirI9.attributes[2].value == `false`){
        theirI9.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirI9.attributes[2].value == `true`){
        hitMessage()
        theirI9.style.backgroundColor= `red`;
        theirI9.setAttribute(`shiptype`, `hit`)
    checkEnemyShips()
    }
})
theirI10.addEventListener("click",ev=>{
    if(theirI10.attributes[2].value == `false`){
        theirI10.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirI10.attributes[2].value == `true`){
        hitMessage()
        theirI10.style.backgroundColor= `red`;
        theirI10.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
    }
})


theirJ1.addEventListener("click",ev=>{
    if(theirJ1.attributes[2].value == `false`){
        theirJ1.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirJ1.attributes[2].value == `true`){
        hitMessage()
        theirJ1.style.backgroundColor= `red`;
        theirJ1.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
    }
})
theirJ2.addEventListener("click",ev=>{
    if(theirJ2.attributes[2].value == `false`){
        theirJ2.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirJ2.attributes[2].value == `true`){
        hitMessage()
        theirJ2.style.backgroundColor= `red`;
        theirJ2.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
    }
})
theirJ3.addEventListener("click",ev=>{
    if(theirJ3.attributes[2].value == `false`){
        theirJ3.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirJ3.attributes[2].value == `true`){
        hitMessage()
        theirJ3.style.backgroundColor= `red`;
        theirJ3.setAttribute(`shiptype`, `hit`)
    checkEnemyShips()
    }
})
theirJ4.addEventListener("click",ev=>{
    if(theirJ4.attributes[2].value == `false`){
        theirJ4.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirJ4.attributes[2].value == `true`){
        hitMessage()
        theirJ4.style.backgroundColor= `red`;
        theirJ4.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
    }
})
theirJ5.addEventListener("click",ev=>{
    if(theirJ5.attributes[2].value == `false`){
        theirJ5.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirJ5.attributes[2].value == `true`){
        hitMessage()
        theirJ5.style.backgroundColor= `red`;
        theirJ5.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
    }
})
theirJ6.addEventListener("click",ev=>{
    if(theirJ6.attributes[2].value == `false`){
        theirJ6.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirJ6.attributes[2].value == `true`){
        hitMessage()
        theirJ6.style.backgroundColor= `red`;
        theirJ6.setAttribute(`shiptype`, `hit`)

    checkEnemyShips()
}
})
theirJ7.addEventListener("click",ev=>{
    if(theirJ7.attributes[2].value == `false`){
        theirJ7.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirJ7.attributes[2].value == `true`){
        hitMessage()
        theirJ7.style.backgroundColor= `red`;
        theirJ7.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
    }
})
theirJ8.addEventListener("click",ev=>{
    if(theirJ8.attributes[2].value == `false`){
        theirJ8.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirJ8.attributes[2].value == `true`){
        hitMessage()
        theirJ8.style.backgroundColor= `red`;
        theirJ8.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
}
})
theirJ9.addEventListener("click",ev=>{
    if(theirJ9.attributes[2].value == `false`){
        theirJ9.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirJ9.attributes[2].value == `true`){
        hitMessage()
        theirJ9.style.backgroundColor= `red`;
        theirJ9.setAttribute(`shiptype`, `hit`)
    
    checkEnemyShips()
    }
})
theirJ10.addEventListener("click",ev=>{
    if(theirJ10.attributes[2].value == `false`){
        theirJ10.style.opacity = 0;
        missMessage()
        if(useTyperWriter == true){
        setTimeout(enemyMessage,1000)
        setTimeout(enemyTurn,3000)}
        else{
        setTimeout(enemyMessage,500)
        setTimeout(enemyTurn,1000)
        }
    }
    else if(theirJ10.attributes[2].value == `true`){
        hitMessage()
        theirJ10.style.backgroundColor= `red`;
        theirJ10.setAttribute(`shiptype`, `hit`)
        checkEnemyShips()
    }
})

checkEnemyShips()
}


let destroyerCount;
let destroyerEventDone = false;

let stealthCount;
let stealthEventDone = false;

let carrierCount;
let carrierEventDone = false;

let cruiserCount;
let cruiserEventDone = false;

let battleshipCount;
let battleshipEventDone = false;

// on each click check the enemy ships that have been exploded
// loop through the enemy divs attributes first
function checkEnemyShips(){
    let destroyerCounter =0;
    let stealthCounter =0;
    let carrierCounter =0;
    let cruiserCounter =0;
    let battleshipCounter =0;

    let enemyShipList = 
    [
     theirA1, theirA2, theirA3, theirA4, theirA5,
     theirA6, theirA7, theirA8, theirA9,theirA10,
     theirB1, theirB2, theirB3, theirB4, theirB5,
     theirB6, theirB7, theirB8, theirB9, theirB10, 
     theirC1, theirC2, theirC3, theirC4, theirC5, 
     theirC6, theirC7, theirC8, theirC9, theirC10, 
     theirD1, theirD2, theirD3, theirD4, theirD5, 
     theirD6, theirD7, theirD8, theirD9, theirD10, 
     theirE1, theirE2, theirE3, theirE4, theirE5, 
     theirE6, theirE7, theirE8, theirE9, theirE10, 
     theirF1, theirF2, theirF3, theirF4, theirF5, 
     theirF6, theirF7, theirF8, theirF9, theirF10,
     theirG1, theirG2, theirG3, theirG4, theirG5, 
     theirG6, theirG7, theirG8, theirG9, theirG10, 
     theirH1, theirH2, theirH3, theirH4, theirH5, 
     theirH6, theirH7, theirH8, theirH9, theirH10,
     theirI1, theirI2, theirI3, theirI4, theirI5, 
     theirI6, theirI7, theirI8, theirI9, theirI10, 
     theirJ1, theirJ2, theirJ3, theirJ4, theirJ5, 
     theirJ6, theirJ7, theirJ8, theirJ9, theirJ10
    ]
    for(let spot in enemyShipList){
        if(enemyShipList[spot].attributes[3]){
            console.log(enemyShipList[spot].attributes[3].value)
            if(enemyShipList[spot].attributes[3].value == `destroyer`){
                destroyerCounter++
            }
            if(enemyShipList[spot].attributes[3].value == `stealth`){
                stealthCounter++
            }
            if(enemyShipList[spot].attributes[3].value == `carrier`){
                carrierCounter++
            }
            if(enemyShipList[spot].attributes[3].value == `cruiser`){
                cruiserCounter++
            }
            if(enemyShipList[spot].attributes[3].value == `battleship`){
                battleshipCounter++
            }
        }
    }
    destroyerCount = destroyerCounter;
    stealthCount = stealthCounter
    carrierCount = carrierCounter;
    cruiserCount = cruiserCounter
    battleshipCount = battleshipCounter;
    console.log(`Destroyers: `+destroyerCount)
    console.log(`Stealth: `+stealthCount)
    console.log(`Carrier: `+carrierCount)
    console.log(`Cruiser: `+cruiserCount)
    console.log(`Battleship: `+battleshipCount)

    if(destroyerCount ==0 && destroyerEventDone == false){
        prompt(`You sunk the Destroyer!`)
        destroyerEventDone = true
    }
    if(stealthCount ==0 && stealthEventDone == false){
        prompt(`You sunk the Stealth Ship!`)
        stealthEventDone = true
    }
    if(carrierCount ==0 && carrierEventDone == false){
        prompt(`You sunk the Carrier!`)
        carrierEventDone = true
    }
    if(cruiserCount ==0 && cruiserEventDone == false){
        prompt(`You sunk the Cruiser!`)
        cruiserEventDone = true
    }
    if(battleshipCount ==0 && battleshipEventDone == false){
        prompt(`You sunk the BattleShip!`)
        battleshipEventDone = true
    }
    if(destroyerCount ==0 && stealthCount ==0 && carrierCount ==0 && cruiserCount ==0 && battleshipCount ==0){
        prompt(`You win!!`)
    }
}

// after the user clicks on a square it's the enemys turn
// display that it's the enemys turn 



let ourA1 = document.getElementById("A1");
let ourA2 = document.getElementById("A2");
let ourA3 = document.getElementById("A3");
let ourA4 = document.getElementById("A4");
let ourA5 = document.getElementById("A5");
let ourA6 = document.getElementById("A6");
let ourA7 = document.getElementById("A7");
let ourA8 = document.getElementById("A8");
let ourA9 = document.getElementById("A9");
let ourA10 = document.getElementById("A10");

let ourB1 = document.getElementById("B1");
let ourB2 = document.getElementById("B2");
let ourB3 = document.getElementById("B3");
let ourB4 = document.getElementById("B4");
let ourB5 = document.getElementById("B5");
let ourB6 = document.getElementById("B6");
let ourB7 = document.getElementById("B7");
let ourB8 = document.getElementById("B8");
let ourB9 = document.getElementById("B9");
let ourB10 = document.getElementById("B10");

let ourC1 = document.getElementById("C1");
let ourC2 = document.getElementById("C2");
let ourC3 = document.getElementById("C3");
let ourC4 = document.getElementById("C4");
let ourC5 = document.getElementById("C5");
let ourC6 = document.getElementById("C6");
let ourC7 = document.getElementById("C7");
let ourC8 = document.getElementById("C8");
let ourC9 = document.getElementById("C9");
let ourC10 = document.getElementById("C10");

let ourD1 = document.getElementById("D1");
let ourD2 = document.getElementById("D2");
let ourD3 = document.getElementById("D3");
let ourD4 = document.getElementById("D4");
let ourD5 = document.getElementById("D5");
let ourD6 = document.getElementById("D6");
let ourD7 = document.getElementById("D7");
let ourD8 = document.getElementById("D8");
let ourD9 = document.getElementById("D9");
let ourD10 = document.getElementById("D10");

let ourE1 = document.getElementById("E1");
let ourE2 = document.getElementById("E2");
let ourE3 = document.getElementById("E3");
let ourE4 = document.getElementById("E4");
let ourE5 = document.getElementById("E5");
let ourE6 = document.getElementById("E6");
let ourE7 = document.getElementById("E7");
let ourE8 = document.getElementById("E8");
let ourE9 = document.getElementById("E9");
let ourE10 = document.getElementById("E10");

let ourF1 = document.getElementById("F1");
let ourF2 = document.getElementById("F2");
let ourF3 = document.getElementById("F3");
let ourF4 = document.getElementById("F4");
let ourF5 = document.getElementById("F5");
let ourF6 = document.getElementById("F6");
let ourF7 = document.getElementById("F7");
let ourF8 = document.getElementById("F8");
let ourF9 = document.getElementById("F9");
let ourF10 = document.getElementById("F10");

let ourG1 = document.getElementById("G1");
let ourG2 = document.getElementById("G2");
let ourG3 = document.getElementById("G3");
let ourG4 = document.getElementById("G4");
let ourG5 = document.getElementById("G5");
let ourG6 = document.getElementById("G6");
let ourG7 = document.getElementById("G7");
let ourG8 = document.getElementById("G8");
let ourG9 = document.getElementById("G9");
let ourG10 = document.getElementById("G10");

let ourH1 = document.getElementById("H1");
let ourH2 = document.getElementById("H2");
let ourH3 = document.getElementById("H3");
let ourH4 = document.getElementById("H4");
let ourH5 = document.getElementById("H5");
let ourH6 = document.getElementById("H6");
let ourH7 = document.getElementById("H7");
let ourH8 = document.getElementById("H8");
let ourH9 = document.getElementById("H9");
let ourH10 = document.getElementById("H10");

let ourI1 = document.getElementById("I1");
let ourI2 = document.getElementById("I2");
let ourI3 = document.getElementById("I3");
let ourI4 = document.getElementById("I4");
let ourI5 = document.getElementById("I5");
let ourI6 = document.getElementById("I6");
let ourI7 = document.getElementById("I7");
let ourI8 = document.getElementById("I8");
let ourI9 = document.getElementById("I9");
let ourI10 = document.getElementById("I10");

let ourJ1 = document.getElementById("J1");
let ourJ2 = document.getElementById("J2");
let ourJ3 = document.getElementById("J3");
let ourJ4 = document.getElementById("J4");
let ourJ5 = document.getElementById("J5");
let ourJ6 = document.getElementById("J6");
let ourJ7 = document.getElementById("J7");
let ourJ8 = document.getElementById("J8");
let ourJ9 = document.getElementById("J9");
let ourJ10 = document.getElementById("J10");



function checkFriendlyShips(){
    let hitCounter=0;

    let ourShipList = 
    [
     ourA1, ourA2, ourA3, ourA4, ourA5,
     ourA6, ourA7, ourA8, ourA9,ourA10,
     ourB1, ourB2, ourB3, ourB4, ourB5,
     ourB6, ourB7, ourB8, ourB9, ourB10, 
     ourC1, ourC2, ourC3, ourC4, ourC5, 
     ourC6, ourC7, ourC8, ourC9, ourC10, 
     ourD1, ourD2, ourD3, ourD4, ourD5, 
     ourD6, ourD7, ourD8, ourD9, ourD10, 
     ourE1, ourE2, ourE3, ourE4, ourE5, 
     ourE6, ourE7, ourE8, ourE9, ourE10, 
     ourF1, ourF2, ourF3, ourF4, ourF5, 
     ourF6, ourF7, ourF8, ourF9, ourF10,
     ourG1, ourG2, ourG3, ourG4, ourG5, 
     ourG6, ourG7, ourG8, ourG9, ourG10, 
     ourH1, ourH2, ourH3, ourH4, ourH5, 
     ourH6, ourH7, ourH8, ourH9, ourH10,
     ourI1, ourI2, ourI3, ourI4, ourI5, 
     ourI6, ourI7, ourI8, ourI9, ourI10, 
     ourJ1, ourJ2, ourJ3, ourJ4, ourJ5, 
     ourJ6, ourJ7, ourJ8, ourJ9, ourJ10
    ]
    for(let spot in ourShipList){
        if(ourShipList[spot].attributes[5]){
            if(ourShipList[spot].attributes[5].value == `hit`){
                console.log(ourShipList[spot].attributes[5].value)
                hitCounter=hitCounter+1
        }
    }}

    if(hitCounter >=17){
        prompt(`You lose!`)
    }
    console.log(hitCounter)
}
