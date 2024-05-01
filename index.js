

import inquirer from "inquirer";
import fs from 'fs'
import colors from 'colors'
import ora from 'ora'


let pet;

    class Pet{
        constructor(name, type, hunger, fatigue, cleanliness, age, happiness, awake, alive){
            this.name = name,
            this.type = type
            this.hunger = hunger
            this.fatigue = fatigue
            this.cleanliness = cleanliness
            this.age         = age
            this.happiness   = happiness
            this.awake       = awake
            this.alive       = alive
        }
    }
    





const petQuestions = [
    {
        name: 'petName',
        type: 'input',
        message: 'What would you like to name your new pet?'
    },
    {
        name: 'petType',
        type: 'list',
        choices: ['Cat', 'Dog', 'Bird', 'Cow', 'Fish'],
        message: 'What kind of pet would you like?',
    }

]


const petActions = [
    {
        name: 'petAction',
        type: 'list',
        choices: ['play', 'clean', 'feed', 'hug', 'let them sleep'],
        message: `What would you like to do with your pet?`
    }
]

//kills pet and calls the person a bad owner
function funeralTime(){
    console.log(`${pet.name} the ${pet.type} has died...`.red)
    process.exit(0)
}

const sleepSpinner = {
    interval: 1000,
    frames: ['(⸝⸝ᴗ﹏ᴗ⸝⸝) zZzZz', '(⸝⸝ᴗ﹏ᴗ⸝⸝)      zZzZz', '(⸝⸝ᴗ﹏ᴗ⸝⸝)              zZzZz']
}
function promptAction(){
    if (!pet.awake){
      const zzz =  ora({spinner: sleepSpinner}).start()
        setTimeout(() => {
            zzz.stop()
            inquirer.prompt([{
                name: 'letSleep',
                type: 'confirm',
                message: `Do you want to let ${pet.name} keep sleeping?`
            }]).then((a)=>{
                if(a.letSleep === true){
                    zzz.start()
                setTimeout(()=>{
                    zzz.stop()
                    pet.awake = true
                    pet.fatigue = 0
                    promptAction()
                }, 10000)
                }else{
                    pet.awake = true
                    zzz.stop()
                    pet.fatigue +=2
                    promptAction()
                }
            })
        }, 3000);
    }else{

    inquirer.prompt(petActions).then((a)=>{
        actions(a.petAction)
        
    })
}
}

function startTimers(){
    const envTick = setInterval(()=>{
        pet.hunger += 0.5
        pet.fatigue += 0.5
        pet.cleanliness -= 0.5
        evalPet(true)
    }, 30000)

    const ageTick = setInterval(()=>{
        pet.age++
    }, 600000)
}


function init(){
    inquirer.prompt(petQuestions).then((a)=>{
        const {petName, petType} = a
         pet = new Pet(petName, petType, 0, 0, 10, 1, 10, false, true)
         console.log(`Congrats on your new pet ${petName} the ${petType}`.green )


        //initializing intervals
        startTimers()
        
        promptAction()
        
    })
}


function evalPet(timer){
    
    //hunger check
    if (pet.hunger >= 3 && pet.hunger < 5){
        console.log(`${pet.name} the ${pet.type}'s stomach growls hungrily`.yellow)
        pet.happiness--
    }else if (pet.hunger >=5 && pet.hunger < 8){
        console.log(`${pet.name} the ${pet.type}'s looks a little sluggish.`.yellow)
        pet.happiness--
        pet.happiness--
    }else if (pet.hunger >= 8 && pet.hunger < 10){
        console.log(`${pet.name} the ${pet.type}'s is curled up on the floor holding their stomache.`.red)
        pet.happiness--
        pet.happiness--
        pet.happiness--
    }else if (pet.hunger >= 10){
        pet.alive = false
        funeralTime()
    }

    //fatigue check
    if (pet.fatigue >= 3 && pet.fatigue < 5 && pet.awake === true){
        console.log(`${pet.name} the ${pet.type}'s lets out a mighty yawn.`.yellow)
        pet.happiness--
    }else if (pet.fatigue >=5 && pet.fatigue < 8 && pet.awake === true){
        console.log(`${pet.name} the ${pet.type}'s eyes begin to droop heavily.`.yellow)
        pet.happiness--
        pet.happiness--
    }else if (pet.fatigue >= 8 && pet.fatigue < 10 && pet.awake === true){
        console.log(`${pet.name} the ${pet.type}'s is curled up on the floor holding their stomache.`.red)
        pet.happiness--
        pet.happiness--
        pet.happiness--
    }else if (pet.fatigue >= 10){
        pet.alive = false
        funeralTime()
    }


    if (!timer){
    setTimeout(()=>{
        console.clear()
    }, 3000)
    
    setTimeout(promptAction, 3100)
}

}


function actions(action){
    if (action === 'let them sleep'){
        action = 'sleep'
    }

    const actionLines = {
        
        playLines: [`${pet.name} kicked your but in a game of chess`],
        feedLines: [`${pet.name} quickly eats a few slices of pizza`],
        cleanLines:[`You grab a brush and start cleaning ${pet.name}, who hops around happily.`],
        hugLines: [`You run up to ${pet.name}, and give them a big hug`],
        sleepLines: [`${pet.name} curls up into a ball and begins to snore`]
    }
    
    const rndLine = Math.floor(Math.random() * actionLines[action+'Lines'].length)
    



    if (action === 'play'){
        console.log(actionLines.playLines[rndLine].brightGreen)
            pet.fatigue++
            pet.hunger+= 0.5
            pet.happiness++
            pet.cleanliness--
    }else if (action === 'hug'){
            console.log(actionLines.hugLines[rndLine].brightGreen)
            pet.fatigue--
            pet.happiness++
            pet.happiness++
    }else if (action === 'feed'){
            console.log(actionLines.feedLines[rndLine].brightGreen)
            pet.fatigue--
            pet.hunger--
            pet.hunger--
            pet.happiness++
    }else if (action === 'clean'){
            console.log(actionLines.cleanLines[rndLine].brightGreen)
            pet.fatigue--
            pet.happiness++
            pet.cleanliness++
    }else if (action === 'sleep'){
        console.log(actionLines.sleepLines[rndLine].brightGreen)
        pet.happiness++
        pet.awake = false
    }


  
    evalPet()
    
}




init()