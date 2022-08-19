 /**
 * Summary.
 *
 * Description.
 *
 * @file    This file test all mysql functions.
 * @author  ptts
 * @since   2022-08-11
 */

const {connect, connectDB, closeConnect, runSql, showDBs, creatDB, deleteDB, useDB, showTBs, createTB, deleteTB, insertRecord, insertRecords, selectRecords, deleteRecords} = require("./mysql-mng");
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
    console.log("==============================");
    console.log(result);
  }, conn);

  console.log("======= 03 : create database =======");

//  await deleteDB(conn, process.env.DB_DATABASE);

  await creatDB(conn, process.env.DB_DATABASE);

  await useDB(conn, process.env.DB_DATABASE);

//  await closeConnect(conn);
//  conn = await connect(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_DATABASE);

  await showTBs((result) => {
    console.log("==============================");
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

  await selectRecords((result) => {
    console.log("==============================");
    console.log(result);
  }, conn, tb_name, "*");

  await selectRecords((result) => {
    console.log("==============================");
    console.log(result);
  }, conn, tb_name, "id, name", "name like 'B%'", "name ASC");
  
  await selectRecords((result) => {
    console.log("==============================");
    console.log(result);
  }, conn, tb_name, "id, name", "name like '_i%'", "name ASC");

  await selectRecords((result) => {
    console.log("==============================");
    console.log(result);
  }, conn, tb_name, "*", undefined, undefined, 5, 3);

  await deleteRecords(conn, tb_name, "name='John'");

  await closeConnect(conn);

  console.log("======= end all-test =======");
}

mysql_all_test();