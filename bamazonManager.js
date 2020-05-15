var mysql = require("mysql");
var inquirer = require("inquirer");

// Connecting to bamazon DB via mysql
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

// Running a function to ask what the manager wants to do
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
        } else if(answer.menu === "Add New Product"){
            addProduct();
        }
    });
}

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
        connection.query("SELECT * FROM products",
        function(err, res) {
            if (err) throw err;
            //if users enter an item ID outside total items range, then throw error message.
            if((parseInt(answer.addInvId) > res.length) || (parseInt(answer.addInvId) <= 0)) {
                console.log("Please enter a valid ID.");
            }
            //otherwise, proceed to loop through the data and find matched item id as the selected item
            var chosenItem = "";
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id === parseInt(answer.addInvId)) {
                chosenItem = res[i];
                }
            }
        
            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: chosenItem.stock_quantity += parseInt(answer.addInvQuant)
                    },
                    {
                        item_id: chosenItem.item_id
                    }
                ],
                function(error) {
                    if (error) throw err;
                    //show message that certain product and its quantity has been updated in the inventory.
                    console.log("Successfully added "+ answer.addInvQuant + " " + chosenItem.product_name + "(s) to the inventory.");
                    viewProducts();
                }
            );
        });
    });
}

// // Function for Add new product
function addProduct(){
    connection.query("SELECT * FROM products",
    function(err, res){
        if(err) throw err;
    });

    inquirer.prompt([
    {
        type: "input",
        message: "Please enter the product name:",
        name: "productName"
    },
    {
        type: "input",
        message: "Please enter the department name:",
        name: "departmentName"
    },
    {
        type: "number",
        message: "Please enter the price:",
        name: "productPrice"
    },
    {
        type: "number",
        message: "Please enter the number of items you are adding:",
        name: "stockAdding"
    }
    ]).then(function(answer){
        var queryString = "INSERT INTO products SET ?";
        connection.query(queryString, {
            product_name: answer.productName,
            department_name: answer.departmentName,
            price: answer.productPrice,
            stock_quantity: answer.stockAdding
        });
        console.log(answer.productName + " has been added to Bamazon.");
        viewProducts();
        connection.end();
    });
}
