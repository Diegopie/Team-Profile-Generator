// * Required Files
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const render = require("./lib/htmlRenderer");
const Choices = require("inquirer/lib/objects/choices");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// * Utilities
// ** Inquirer Validation
const valInput = function stringCheck(inp) {
    if (inp == "") {
        return "Please Enter Valid Information";
    }
    return true;
};
// ** Contain Employee Info
let empData = []
// ** RNG for default IDs


//(name , id, email, officeNumber
// * Inquirer Questions
// ** For Intro
const intro = [
    { // Start 
        type: "confirm",
        name: "start",
        message: "Start by adding information on the team manager",
    }           
];
    // For Employees
function globalQ (title) {
    return [
        // { // Name
        //     type: "input", 
        //     name: "name",
        //     message: `What is the name of the ${title}?`,
        //     validate: valInput
        // },
        // { // id
        //     type: "input", 
        //     name: "id",
        //     message: `What is the ${title}'s id?`,
        //     validate: valInput
        // },
        // { // Email
        //     type: "input", 
        //     name: "email",
        //     message: `What is the ${title}'s email?`,
        //     validate: valInput
        // }
    ];
};

const specifQ = [
    { // Office Number
        type: "input",
        name: "offNum",
        message: "What is the office number?"
    },
    {
        type: "input",
        name: "school",
        message: "What school did they attend?"
    },
    {
        type: "input",
        name: "github",
        message: "What is their GitHub profile name?"
    }
];

const more =
{ 
    type: 'confirm',
    name: 'more',
    message: 'Would you like to add another employee?'
};

// Begins Asking For User Response
function start () {
    inquirer
        .prompt([
            { // Start 
                type: "confirm",
                name: "start",
                message: "Start by adding information on the team manager.",
            } 
        ]).then(function (data) {
            if (!data.start) {
                return false;
            }
            manage()
        });    
};

function typeCheck() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'type',
                message: "What kind of employee would you like to add?",
                choices: ['Intern', 'Engineer']
            }
        ]).then(data => {
            if (data.type == 'Intern') {
                subHuman();
            } else if (data.type == 'Engineer') {
                engin();
            };
        });
}; 

// Prompts Questions For the Team Manager
function manage () {
    // Run globalQ() to return questions with manger title
    let fullMan = globalQ('manager')
    // Push manger specific question and more question to fullMan array;
    fullMan.push(specifQ[0], more)
            // console.log(fullMan);
    inquirer
        .prompt(fullMan)
        .then(function(data){
                        // console.log(data);
            const man = new Manager(data.name, data.id, data.email, data.offNum);
                        // console.log(man);
            empData.push(man);
            if (!data.more) {
                // Run employee check
                return renderer();
            };
            typeCheck();
        });
};

function subHuman () {
    // Run globalQ() to return questions with manger title
    let fullSub = globalQ('intern')
    // Push manger specific question and more question to fullMan array;
    fullSub.push(specifQ[1], more)
            // console.log(fullMan);
    inquirer
        .prompt(fullSub)
        .then(function(data){
                        // console.log(data);
            const sub = new Intern(data.name, data.id, data.email, data.school);
                        // console.log(sub);
            empData.push(sub);
            if (!data.more) {
                // Run employee check
                return renderer();
            };
            typeCheck();
        });
};

function engin () {
    // Run globalQ() to return questions with manger title
    let v8 = globalQ('engineer')
    // Push manger specific question and more question to fullMan array;
    v8.push(specifQ[2], more)
            // console.log(fullMan);
    inquirer
        .prompt(v8)
        .then(function(data){
                        // console.log(data);
            const audi = new Engineer(data.name, data.id, data.email, data.github);
                        // console.log(audi);
            empData.push(audi);
            if (!data.more) {
                // Run employee check
                return renderer();
            };
            typeCheck();
        });
};


// * Create HTML
function renderer() {
    const html = render(empData);
    console.log(html);
}

start();



// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
