// * Required Files
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const render = require("./lib/htmlRenderer");
const Choices = require("inquirer/lib/objects/choices");


// * File Pathing
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");


// * Utilities
// ** Inquirer Validation
const validate = 
{
    string: (inp) => {
        if(inp == "") {
            return "Please Enter Valid Information";
        }
        return true;
    },
    // Figure out regex for email
    email: (inp) => {
        if(inp == "") {
            return "Please Enter Valid Information";
        }
        return true;
    }
}

// ** Contain Employee Info
let empData = [];

// ** RNG for default IDs
    // We'll see if I actually do this. The idea is to create an ID number if the user does not want to input one


// * Inquirer Prompts
// ** For All Employees
function globalQ (title) {
    return [
        { // Name
            type: "input", 
            name: "name",
            message: `What is the name of the ${title}?`,
            validate: validate.string
        },
        { // ID
            type: "input", 
            name: "id",
            message: `What is the ${title}'s id?`,
            validate: validate.string
        },
        { // Email
            type: "input", 
            name: "email",
            message: `What is the ${title}'s email?`,
            validate: validate.email
        }
    ];
};

// ** Contain Questions For Specific Employee Types
const specifQ = {
    manager: { 
        type: "input",
        name: "offNum",
        message: "What is the office number?",
        validate: validate.string
    },
    intern: { 
        type: "input",
        name: "school",
        message: "What school did they attend?",
        validate: validate.string
    },
    engineer: {
        type: "input",
        name: "github",
        message: "What is their GitHub profile name?",
        validate: validate.string
    }
};

// ** Prompt to Add More Employees
const more =
{ 
    type: 'confirm',
    name: 'more',
    message: 'Would you like to add another employee?'
};


// * Inquirer Instances
// ** Begins Asking For User Response, First Code That Runs on This File
function start () {
    inquirer
        .prompt([
            { // Start-Welcome
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

// ** Prompts Questions For the Team Manager
function manage () {
    // Run globalQ() to return questions with manger title;
    let fullMan = globalQ('manager')
    // Push manger specific question and more question to fullMan array;
    fullMan.push(specifQ.manager, more)
            // console.log(fullMan);
    inquirer
        .prompt(fullMan)
        .then(function(data){
                        // console.log(data);
            const man = new Manager(data.name, data.id, data.email, data.offNum);
                        // console.log(man);
            // Push new constructor instance to empData array;
            empData.push(man);
            if (!data.more) {
                // Run renderer if user does not want a new employee;
                return renderer();
            };
            // Run typeCheck to add a new employee;
            typeCheck();
        });
};

// ** Prompt The Employee Type to Create, then Check Response and Run Accompanying Function 
function typeCheck() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'type',
                message: "What type of employee would you like to add?",
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

function subHuman () {
    // Run globalQ() to return questions with intern title
    let fullSub = globalQ('intern')
    // Push intern specific question and more question to fullSub array;
    fullSub.push(specifQ.intern, more)
            // console.log(fullMan);
    inquirer
        .prompt(fullSub)
        .then(function(data){
            const sub = new Intern(data.name, data.id, data.email, data.school);
            // Push new constructor instance to empData array;
            empData.push(sub);
            if (!data.more) {
                return renderer();
            };
            typeCheck();
        });
};

function engin () {
    // Run globalQ() to return questions with manger title
    let v8 = globalQ('engineer')
    // Push manger specific question and more question to fullMan array;
    v8.push(specifQ.engineer, more)
            // console.log(fullMan);
    inquirer
        .prompt(v8)
        .then(function(data){
            const audiR8 = new Engineer(data.name, data.id, data.email, data.github);
                        // console.log(audiR8);
            // Push new constructor instance to empData array;
            empData.push(audiR8);
            if (!data.more) {
                return renderer();
            };
            typeCheck();
        });
};


// * Create HTML
function renderer() {
                    // console.log(empData);
                    // console.log(render(empData));
    // Check of output folder exists
    if(!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    };
    // Write file to output folder
    fs.writeFile(outputPath, render(empData), err =>{
        if (err) {
            throw err;
        };
        console.log("Your file has been created!");
    });
};

// Start the code 😎
start();

