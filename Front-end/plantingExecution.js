import {createMachine, interpret} from 'xstate'
import { Farmbot } from 'farmbot';

const fb = new Farmbot({
    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ1bmtub3duIiwic3ViIjoxMzc4NSwiaWF0IjoxNjQ2MjQxMjc1LCJqdGkiOiI2NTU0OTJkNy0wNDhmLTQzOWMtOWQzYi1jMDIzOGU3YjEzNWUiLCJpc3MiOiIvL215LmZhcm0uYm90OjQ0MyIsImV4cCI6MTY1MTQyNTI3NSwibXF0dCI6ImNsZXZlci1vY3RvcHVzLnJtcS5jbG91ZGFtcXAuY29tIiwiYm90IjoiZGV2aWNlXzEzODA5Iiwidmhvc3QiOiJ4aWNvbmZ1bSIsIm1xdHRfd3MiOiJ3c3M6Ly9jbGV2ZXItb2N0b3B1cy5ybXEuY2xvdWRhbXFwLmNvbTo0NDMvd3MvbXF0dCJ9.mBmqYXMAZJe3ah0AJpl3O7w1NWUsWl9QCfdSMHwt31AHJutJwva3a8OLIlJcyd87xhDhS98b40venizb5YR3W5uwNyo05HfnwW8F0FOrRCmI9_97o-c0ERW196SDMNoWEpGoziUIxbsYPBfuLbqtaSm8Rc7cnOx_R38RXa6RTXTQl2rrtYN8179xCswYPKR0kUeNxxFTLm5EVZrIFMxeWe0DXmy-ts1-2tmchNhkFVD1WqsMcXC2_hYuRKq7dNhzy1no93RRB3aHUhb4A8zUTjO3Bqzm959u_J-RrdHDq65399tr_3QMfcQzxY11zayJRBpnWAiIeomcXPfWaKFElA"
})


//Moving the farmBot
/*function moveBot(dir){
    console.log("Moving by " + dir);
    return fb.moveRelative({x: dir, y: 0, z: 0, speed: 100});
}*/

function moveToBase(x,y){
    console.log("Moving to ("+x+","+y+")");
    return fb.moveAbsolute({x: x, y: y, z:0, speed: 100});
    //return new Promise(resolve => setTimeout(resolve, 2000));
}

function moveToPosition(x,y){
    console.log("Moving to ("+x+","+y+")");
    return fb.moveAbsolute({x: x, y: y, z:0, speed: 100});
    //return new Promise(resolve => setTimeout(resolve, 2000));
}

async function pickUpSeed(){
    console.log("Picking up a seed")
    await fb.moveRelative({x: 0, y: 0, z: -50, speed: 100});
    //await fb.togglePin({ pin_number: 9});
    await fb.writePin({pin_mode: 0, pin_number: 9, pin_value: 1})
    return fb.moveRelative({x: 0, y: 0, z: 50, speed: 100});
    //return new Promise(resolve => setTimeout(resolve, 2000));
}

async function plantSeed(depth){
    console.log("Planting seed at depth "+ depth)
    await fb.moveRelative({x: 0, y: 0, z: -(100+depth), speed: 100});
    //await fb.togglePin({ pin_number: 9});
    await fb.writePin({pin_mode: 0, pin_number: 9, pin_value: 0})
    return fb.moveRelative({x: 0, y: 0, z: 100+depth, speed: 100});
    //return new Promise(resolve => setTimeout(resolve, 2000));
}


//toggling on light
/*function toggleLight() {
    console.log("Switching Lights");
    return fb.togglePin({ pin_number: 7 });
}*/

function convertToDistance(density){
    return Math.ceil(1000/Math.floor(Math.sqrt(density)));
}

function createGrid(x1, x2, y1, y2, minDistance) {
    const startX = Math.min(x1,x2);
    const startY = Math.min(y1,y2);
    let grid = [];
    let x = startY+Math.floor(minDistance/2);
    while(x+Math.ceil(minDistance/2)<=Math.max(x1,x2)){
        let y = startX+Math.floor(minDistance/2);
        while(y+Math.ceil(minDistance/2)<=Math.max(y1,y2)){
            grid.push({xVal: x, yVal: y})
            y=y+minDistance;
        }
        x=x+minDistance;
    }
    return grid;
}

export async function plantingSeeds(x1, x2, y1, y2, minDistance, depth){
    let grid = createGrid(x1, x2, y1, y2, minDistance);
    let counter = 0;
    const plantMachine = createMachine(
        {
            id: 'planting',
            initial: 'start',
            states: {
                start: {
                    entry: ['moveHome'],
                    on: {
                        TRIGGER: {
                            target: 'grabSeed'
                        }
                    }
                },
                grabSeed: {
                    // entry actions
                    entry: ['pickSeed'],
                    on: {
                        TRIGGER: { target: 'moveToPos' }
                    }
                },
                moveToPos: {
                    entry:['movePos'],
                    on: {
                        TRIGGER: { target: 'plantSeed'}
                    }
                },
                plantSeed: {
                    entry:['plantSeed'],
                    on: {
                        TRIGGER: {target: 'moveBack'},
                        COMPLETE: {target: 'done'}
                    }
                },
                moveBack:{
                    entry: ['moveToSeed'],
                    on: {
                        TRIGGER: {target: 'grabSeed'}
                    }
                },
                done: {
                    entry: ['closeMachine']
                }
            }
        },
        {
            actions: {
                // action implementations
                moveHome: () => {
                    moveToBase(grid[0].xVal, 0).then(() => farmMachine.send("TRIGGER"));
                },
                movePos: () => {
                    moveToPosition(grid[counter].xVal, grid[counter].yVal).then(() => farmMachine.send("TRIGGER"));
                },
                moveToSeed: () =>{
                    moveToPosition(grid[counter].xVal, 0).then(()=>farmMachine.send("TRIGGER"))
                },
                pickSeed: () => {
                    pickUpSeed().then(() => farmMachine.send("TRIGGER"));
                },
                plantSeed: () => {
                    counter = counter+1;
                    plantSeed(depth).then(() => {
                        if (counter===grid.length){ farmMachine.send("COMPLETE")}
                        else {farmMachine.send("TRIGGER")}
                    })
                },
                closeMachine: () => {
                    fb.client.end()
                    farmMachine.stop();
                }
            }
        }
    );
    await fb.connect();
    const farmMachine = interpret(plantMachine).start();
}

/*
let testGrid=createGrid(0,1000,0,1000, 200);
console.log("Das erstellte Grid:")
console.log(testGrid);
console.log("Die Anzahl Pflanzen beträgt: " + testGrid.length);
 */

//plantingSeeds(0, 500, 0, 500, 200, 50);




//await fb.connect();
//moveToBase(100,100);
