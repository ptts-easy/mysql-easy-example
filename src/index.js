 /**
 * Summary.
 *
 * Description.
 *
 * @file    This file test all mysql functions.
 * @author  ptts
 * @since   2022-08-11
 */

const {
  connect, 
  connectDB, 
  closeConnect, 
  runSql, 
  showDBs, 
  creatDB, 
  deleteDB, 
  useDB, 
  showTBs, 
  createTB, 
  deleteTB, 
  insertRecord, 
  insertRecords, 
  selectRecords, 
  deleteRecords,
  joinTBs
} = require("./mysql-mng");
require("dotenv/config");

async function mysql_all_test() {

  console.log("======= start all-test =======");

  console.log("======= 01 : environment config =======");

  console.log(`DB_HOST=${process.env.DB_HOST}`);
  console.log(`DB_PORT=${process.env.DB_PORT}`);
  console.log(`DB_USER=${process.env.DB_USER}`);
  console.log(`DB_PASSWORD=${process.env.DB_PASSWORD}`);
  console.log(`DB_DATABASE=${process.env.DB_DATABASE}`);

  console.log("======= 02 : connect =======");

  let conn = await connect(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER, process.env.DB_PASSWORD);

  await showDBs((result) => {
    console.log("=============== showDBs ===============");
    console.log(result);
  }, conn);

  console.log("======= 03 : create database =======");

//  await deleteDB(conn, process.env.DB_DATABASE);

  await creatDB(conn, process.env.DB_DATABASE);

  await useDB(conn, process.env.DB_DATABASE);

//  await closeConnect(conn);
//  conn = await connectDB(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_DATABASE);

  await showTBs((result) => {
    console.log("================ showTBs ==============");
    console.log(result);
  }, conn);

  console.log("======= 04 : create table =======");

  let tb_name = "customers";

  await deleteTB(conn, tb_name);

  await createTB(conn, tb_name, "id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255)");

  await insertRecord(conn, tb_name, "name, address", "'Company Inc', 'Highway 37'");

  let values = [
    ['John', 'Highway 71'],
    ['Peter', 'Lowstreet 4'],
    ['Amy', 'Apple st 652'],
    ['Hannah', 'Mountain 21'],
    ['Michael', 'Valley 345'],
    ['Sandy', 'Ocean blvd 2'],
    ['Betty', 'Green Grass 1'],
    ['Richard', 'Sky st 331'],
    ['Susan', 'One way 98'],
    ['Vicky', 'Yellow Garden 2'],
    ['Ben', 'Park Lane 38'],
    ['William', 'Central st 954'],
    ['Chuck', 'Main Road 989'],
    ['Viola', 'Sideway 1633']
  ];

  await insertRecords(conn, tb_name, "name, address", values);

  console.log("======= 05 : show table =======");

  await selectRecords((result) => {
    console.log("============== Show All Records ================");
    console.log(result);
  }, conn, tb_name, "*");

  await selectRecords((result) => {
    console.log("=============== Filter ===============");
    console.log(result);
  }, conn, tb_name, "id, name", "name like 'B%'", "name ASC");
  
  await selectRecords((result) => {
    console.log("=============== Filter ===============");
    console.log(result);
  }, conn, tb_name, "id, name", "name like '_i%'", "name ASC");

  await selectRecords((result) => {
    console.log("============== Limit ================");
    console.log(result);
  }, conn, tb_name, "*", undefined, undefined, 3, 5);

  await deleteRecords(conn, tb_name, "name='John'");

  console.log("======= 06 : join table =======");

  await deleteTB(conn, "users");
  await createTB(conn, "users", "id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), favorite_product INT");
  await insertRecords(conn, "users", "id, name, favorite_product", 
    [
      [1, 'John', 154],
      [2, 'Peter', 154],
      [3, 'Amy', 155],
      [4, 'Hannah', 0],
      [5, 'Michael', 0]
    ]);

  await deleteTB(conn, "products");
  await createTB(conn, "products", "id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255)");
  await insertRecords(conn, "products", "id, name", 
    [
      [154, 'Chocolate Heaven'],
      [155, 'Tasty Lemons'],
      [156, 'Vanilla Dreams']
    ]);

  await joinTBs((result) => {
    console.log("============== Join Tables ================");
    console.log(result);
  }, conn, "users", "products", "users.name AS user, products.name AS favorite", "users.favorite_product = products.id");

  await closeConnect(conn);

  console.log("======= end all-test =======");
}

(async () => {
  await mysql_all_test();
})();