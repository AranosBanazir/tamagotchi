

import inquirer from "inquirer";
import fs from 'fs/promises'
import colors from 'colors'
import ora from 'ora'


let pets;
let currentPet;
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
        changeStat(dir, stat, num = 1){
            // if (!this[stat]) throw Error(`"${stat}" is not a valid stat name`)

            // console.log(this[stat])
                
        

            if (dir === 'dec'){
                if (this[stat] - num <= 0){
                    this[stat] = 0
                    return
                 }
                if (this[stat] >0){
                    this[stat] -= num
                }
            }else if (dir === 'inc'){
                 if (this[stat] + num >= 10){
                    this[stat] = 10
                    return
                 }
                 if (this[stat] < 10){
                    this[stat] += num
                } 
            }
        }
    }  


let petOptions = []

const petQuestions = [
    {
        name: 'petName',
        type: 'input',
        prefix: '',
        message: 'What would you like to name your new pet?'
    },
    {
        name: 'petType',
        type: 'list',
        prefix: '',
        choices: ['Cat', 'Dog', 'Bird', 'Cow', 'Fish'],
        message: 'What kind of pet would you like?',
    }

]


const petActions = [
    {
        name: 'petAction',
        type: 'list',
        prefix: '',
        choices: ['play', 'clean', 'feed', 'hug', 'let them sleep', 'Quit for now'],
        message: `What would you like to do with your pet?`
    }
]

//kills pet and calls the person a bad owner
function funeralTime(){
    console.log(`${currentPet.name} the ${currentPet.type} has died...`.red)
    process.exit(0)
}

const sleepSpinner = {
    interval: 1000,
    frames: ['(⸝⸝ᴗ﹏ᴗ⸝⸝) zZzZz', '(⸝⸝ᴗ﹏ᴗ⸝⸝)      ZzZzZ', '(⸝⸝ᴗ﹏ᴗ⸝⸝)              zZzZz']
}
function promptAction(){
    if (!currentPet.awake){
      const zzz =  ora({spinner: sleepSpinner}).start()
        setTimeout(() => {
            zzz.stop()
            inquirer.prompt([{
                name: 'letSleep',
                type: 'confirm',
                prefix: '',
                message: `Do you want to let ${currentPet.name} keep sleeping?`
            }]).then((a)=>{
                if(a.letSleep === true){
                    zzz.start()
                setTimeout(()=>{
                    zzz.stop()
                    currentPet.awake = true
                    currentPet.fatigue = 0
                    promptAction()
                }, 10000)
                }else{
                    currentPet.awake = true
                    zzz.stop()
                    currentPet.fatigue +=2
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
        currentPet.changeStat('inc', 'hunger')
        currentPet.changeStat('inc', 'fatigue')
        currentPet.changeStat('dec', 'cleanliness')
        evalPet(true)
    }, 120000)

    const ageTick = setInterval(()=>{
        currentPet.age++
    }, 300000)
}




async function init(){
 pets = await fs.readFile('./pets.txt', 'utf-8')
 const petArray = JSON.parse(pets)

 if (petArray.length >0){
    petOptions = petArray.map(animal => animal.name + ' The ' + animal.type)

    inquirer.prompt({
        name: 'pickedPet',
        type: 'list',
        message: 'Which pet would you like to play with?',
        choices: [...petOptions, 'New Friend'],
        prefix: ''
    })
        .then((a)=>{
            if (a.pickedPet === 'New Friend'){
                inquirer.prompt(petQuestions).then((a)=>{
                    const {petName, petType} = a
                     currentPet = new Pet(petName, petType, 0, 0, 10, 1, 10, true, true)
                     console.log(`Congrats on your new pet ${petName} the ${petType}`.green )
            
            
                    //initializing intervals
                    startTimers()
                    
                    promptAction()
                    
                })
            }else{
          const selectedPet =  petArray.filter(animal => animal.name + ' The ' + animal.type === a.pickedPet)
            const {name, type, hunger, fatigue, cleanliness, age, happiness, awake, alive} = selectedPet[0]
            currentPet = new Pet(name, type, hunger, fatigue, cleanliness, age, happiness, awake, alive) 
            console.log(`${currentPet.name} the ${currentPet.type} wakes up with a big yawn.`.green )
            startTimers()
        
            promptAction()
            }
        })
    
 }else{
    inquirer.prompt(petQuestions).then((a)=>{
        const {petName, petType} = a
         currentPet = new Pet(petName, petType, 0, 0, 10, 1, 10, true, true)
         console.log(`Congrats on your new pet ${petName} the ${petType}`.green )


        //initializing intervals
        startTimers()
        
        promptAction()
        
    })
 }
}


function evalPet(timer){
    

    if (!timer){
        setTimeout(()=>{
            console.clear()
        }, 3500)
        
        setTimeout(promptAction, 3600)
    }


    //hunger check
    if (currentPet.hunger >= 3 && currentPet.hunger < 5){
        console.log('\n' + '['.green + 'Hunger'.red + ']:'.green +`${currentPet.name} the ${currentPet.type}'s stomach growls hungrily.`.yellow)
    }else if (currentPet.hunger >=5 && currentPet.hunger < 8){
        console.log('\n' + '['.green + 'Hunger'.red + ']:'.green +`${currentPet.name} the ${currentPet.type} looks a little sluggish.`.yellow)
    }else if (currentPet.hunger >= 8 && currentPet.hunger < 10){
        console.log('\n' + '['.green + 'Hunger'.red + ']:'.green +`${currentPet.name} the ${currentPet.type}'s is curled up on the floor holding their stomache.`.red)
    }else if (currentPet.hunger >= 10){
        currentPet.alive = false
        funeralTime()
    }

    //fatigue check
    if (currentPet.fatigue >= 3 && currentPet.fatigue < 5 && currentPet.awake === true){
        console.log('\n' + '['.green + 'Tired'.red + ']:'.green +` ${currentPet.name} the ${currentPet.type} lets out a mighty yawn.`.yellow)
    }else if (currentPet.fatigue >=5 && currentPet.fatigue < 8 && currentPet.awake === true){
        console.log('\n' + '['.green + 'Tired'.red + ']:'.green +`${currentPet.name} the ${currentPet.type}'s eyes begin to droop heavily.`.yellow)

    }else if (currentPet.fatigue >= 8 && currentPet.fatigue < 10 && currentPet.awake === true){
        console.log('\n' + '['.green + 'Tired'.red + ']:'.green +`${currentPet.name} the ${currentPet.type} looks exhausted.`.red)
        currentPet.awake = false
    }else if (currentPet.fatigue >= 10){
        currentPet.alive = false
        funeralTime()
    }

    //happy check
    if (currentPet.happiness <=7 && currentPet.happiness >5 && currentPet.awake === true){
        console.log('\n' + '['.green + 'Happiness'.red + ']:'.green +`${currentPet.name} the ${currentPet.type} .`.yellow)
    }else if (currentPet.happiness <=5 && currentPet.happiness >3 && currentPet.awake === true){
        console.log('\n' + '['.green + 'Happiness'.red + ']:'.green +`${currentPet.name} the ${currentPet.type}'s eyes begin to droop heavily.`.yellow)
    }else if (currentPet.happiness <=3 && currentPet.happiness >0 && currentPet.awake === true){
        console.log('\n' + '['.green + 'Happiness'.red + ']:'.green +`${currentPet.name} the ${currentPet.type} looks exhausted.`.red)
        currentPet.awake = false
    }else if (currentPet.happiness <=0){
        currentPet.alive = false
        funeralTime()
    }


}


function actions(action){
    if (action === 'let them sleep'){
        action = 'sleep'
    }else if (action === 'Quit for now'){
        action = 'quit'
    }

    const actionLines = {
        
        playLines: [`${currentPet.name} kicked your butt in a game of chess.`,
                    `You take ${currentPet.name} outside for a nice walk.`,
                   ],
        feedLines: [`${currentPet.name} quickly eats a few slices of pizza.`],
        cleanLines:[`You grab a brush and start cleaning ${currentPet.name}, who hops around happily.`],
        hugLines: [`You run up to ${currentPet.name}, and give them a big hug.`],
        sleepLines: [`${currentPet.name} curls up into a ball and begins to snore.`],
        quitLines: []
    }
    
    const rndLine = Math.floor(Math.random() * actionLines[action+'Lines'].length)
    



    if (action === 'play'){
        console.log('\n'+actionLines.playLines[rndLine].brightGreen)
            currentPet.changeStat('inc', 'fatigue')
            currentPet.changeStat('inc', 'hunger', 0.5)
            currentPet.changeStat('inc', 'happiness')
            currentPet.changeStat('inc', 'happiness')
    }else if (action === 'hug'){
            console.log('\n'+actionLines.hugLines[rndLine].brightGreen)
            currentPet.changeStat('dec', 'fatigue')
            currentPet.changeStat('inc', 'happiness')
            currentPet.changeStat('inc', 'happiness')
    }else if (action === 'feed'){
            console.log('\n'+actionLines.feedLines[rndLine].brightGreen)
            currentPet.changeStat('dec', 'fatigue')
            currentPet.changeStat('dec', 'hunger')
            currentPet.changeStat('dec', 'hunger')
            currentPet.changeStat('inc', 'happiness')
    }else if (action === 'clean'){
            console.log('\n'+actionLines.cleanLines[rndLine].brightGreen)
            currentPet.changeStat('dec', 'fatigue')
            currentPet.changeStat('inc', 'happiness')
            currentPet.changeStat('inc', 'cleanliness')
    }else if (action === 'sleep'){
        console.log('\n'+actionLines.sleepLines[rndLine].brightGreen)
        currentPet.changeStat('inc', 'happiness')
        currentPet.awake = false
    }else if (action === 'quit'){
              
            handleQuit()
          }


  if (action !== 'quit'){
      evalPet()
  }
    
}


async function handleQuit(){
    let petArray
    const petFile = await fs.readFile('./pets.txt', 'utf-8')
    petArray = JSON.parse(petFile)
    let hasPet = false



        petArray.forEach(animal =>{
        if ((animal.name === currentPet.name && animal.type === currentPet.type)){
            hasPet = true
            animal.fatigue = currentPet.fatigue
            animal.hunger  = currentPet.hunger
            animal.happiness = currentPet.happiness
            animal.awake     = currentPet.awake
            animal.alive     = currentPet.alive
            animal.age       = currentPet.age
        }
    })

        if (!hasPet){
        petArray.push(currentPet)
        }
       await fs.writeFile('./pets.txt', JSON.stringify(petArray))
       console.clear()
       console.log('Thanks for playing!'.brightGreen)
       process.exit(0)

        

}

init()