const inquirer = require('inquirer');

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon_db"
});


function showProducts() {
  connection.query("SELECT * FROM products", (err, res) => {
    if (err) throw err;
    console.table(res);
  });
};



function start() {
  showProducts();

  inquirer
    .prompt([

      {
        type: "number",
        message: "What is the id of the product you wish to buy?",
        name: "product"
      },

      {
        type: "number",
        message: "How many would you like?",
        name: "stock"
      }
    ])
    .then(function (answer) {

      // connection.query("SELECT * FROM products WHERE id = ? AND stock = ?",
      //   [answer.product, answer.stock],
      //   function (error, res) {
      //     if (error) throw err;


      //     console.log(res);


      //   });


      connection.query("SELECT * FROM products WHERE id = ?",
        [answer.product],
        function (error, res) {
          if (error) throw err;

          let user_product = res[0];

          // console.log(user_product.stock);

          if (user_product.stock >= answer.stock) {

            console.table("You're in luck! This is in stock.");

            let new_quantity = user_product.stock - answer.stock;

            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock: new_quantity
                },
                {
                  id:  answer.product 
                }
              ],
              function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " products quantity updated!\n");

                let user_debt = user_product.price * answer.stock;
                
                console.log("You owe $"  + user_debt + " for " + user_product.product_name);


              });
            
          
        } else {
          console.log("Insufficient quantity!");
        }

        });

});

};


connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});
