//Connecting to mysql and inquirer packages
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

// Running a function to pull data from products table
connection.connect(function(err){
    if (err) throw err;
    getInfo();
});

// Function to return all columns from products table
function getInfo(){
    connection.query(
        "SELECT item_id, product_name, department_name, price, stock_quantity FROM products",
    function(err, res){
        if (err) throw err;
        console.table(res);
    });
    askQuestions();
}

// Function to ask user for purchase info and check database for quantity
function askQuestions(answer){
    inquirer.prompt([
    {
        type: "number",
        message: "Please enter the item ID of the item you'd like to purchase: ",
        name: "gettingItem"
    },
    {
        type: "number",
        message: "Please enter the number of units of this item you'd like to purchase: ",
        name: "gettingQuantity"
    }
    ]).then(function(answer){
        connection.query("SELECT * FROM products WHERE ?",
            {
                item_id: answer.gettingItem
            },
        function(err, res){
            if(err) throw err;
            var total = res[0].price * parseInt(answer.gettingQuantity);
            if (answer.gettingQuantity > res[0].stock_quantity) {
                console.log("Sorry, there are only " + res[0].stock_quantity + " " + res[0].product_name + "s left.");
                askQuestions();
            } else {
                console.log("You bought " + answer.gettingQuantity + " " + res[0].product_name + "(s) for $" + total + ".00!");
                // Update database to reflect stock_quantity changes
                var quantityLeft = res[0].stock_quantity - answer.gettingQuantity;
                //console.log(quantityLeft);
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: quantityLeft
                        },
                        {
                            item_id: answer.gettingItem
                        }
                    ],
                function(err) {
                if (err) throw err;
                }); 
                console.log("Inventory updated. There are " + quantityLeft + " " + res[0].product_name + "(s) left. Have a nice day!"); 
                askQuestions();
            }
        }); 
    });  
}
