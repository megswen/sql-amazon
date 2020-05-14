var mysql = require("mysql");
var inquirer = require("inquirer");
// Var to require bamazonCustomer file

// Connecting to bamazon DB via mysql
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

// Running a function to pull data from products table
connection.connect(function(err){
    if (err) throw err;
    menuOptions();
});

// Function to list menu options
function menuOptions(answer){
    inquirer.prompt([
        {
            type: "list",
            message: "Welcome, Manager! Please select an action from the menu.",
            name: "menu",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function(answer){
        if(answer.menu === "View Products for Sale"){
            viewProducts();
        }
        if(answer.menu === "View Low Inventory"){
            lowInventory();
        }
        if(answer.menu === "Add to Inventory"){
            addInventory();
        } else {
            //addProduct();
        }
    });
}

// Connect to queries down here for every function that needs it
// Function for View products for sale
function viewProducts(){
    connection.query("SELECT * FROM products",
    function(err, res){
        if(err) throw err;
        console.table(res);
    });
}

// Function for Low inventory
function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5",
    function(err, res){
        if(err) throw err;
        console.table(res);
    });
}

// // Function for Add to inventory
function addInventory(){
    connection.query("SELECT * FROM products",
    function(err, res){
        if(err) throw err;
        console.log("\n");
        console.table(res);
    });

    inquirer.prompt([
    {
        type: "number",
        message: "Please enter the Item ID of the product you would like to add to:",
        name: "addInvId"
    },
    {
        type: "number",
        message: "Please enter the number of items you would like to add to your stock:",
        name: "addInvQuant"
    }
    ]).then(function(answer){
        // START HERE




    });
}

// // Function for Add new product
// function addProduct(){

// }
// End connection

///////////////
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.