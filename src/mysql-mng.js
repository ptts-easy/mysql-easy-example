var mysql = require('mysql');

async function connect(host, port, user, password) {
  
  var conn = await mysql.createConnection({host:host, port:port, user:user, password:password});

  await conn.connect(function(err) {
    if (err) {
      throw err;
    }
    console.log("Connected!");
  });

  return conn;
}

async function connectDB(host, user, password, database) {
  
  var conn = await mysql.createConnection({host:host, user:user, password:password, database:database});

  await conn.connect(function(err) {
    if (err) {
      throw err;
    }
    console.log("Connected!");
  });

  return conn;
}

async function closeConnect(conn) {
  
  await conn.end(function(err) {
    if (err) {
      throw err;
    }
    console.log("Closed!");
  });
}

async function runSql(conn, sql, values = undefined, callback = undefined) {
  if (values == undefined) {
    await conn.query(sql, function (err, result) {
      if (err) {
        throw err;
      }
      if (callback != undefined) {
        callback(result);
      }
    }); 
  } else {
    await conn.query(sql, [values], function (err, result) {
      if (err) {
        throw err;
      }
      if (callback != undefined) {
        callback(result);
      }
    }); 
  }
}

async function runSql_ex(conn, sql, values = undefined) {
  let query = undefined;

  if (values == undefined) {
    query = conn.query(sql, function (err, result) {
      if (err) {
        throw err;
      }
      return result;
    }); 
  } else {
    query = conn.query(sql, [values], function (err, result) {
      if (err) {
        throw err;
      }
      return result;
    }); 
  }

  if (query != undefined) {
    query
      .on('error', function(err) {
        console.log("runSql::error");
      })
      .on('fields', function(fields) {
        console.log("runSql::fields");
      })
      .on('result', function(row) {
        console.log("runSql::result");
        console.log(result);
      })
      .on('end', function() {
        console.log("runSql::end");
      });
  }
}

async function creatDB(conn, database) {
  return await runSql(conn, `CREATE DATABASE IF NOT EXISTS ${database}`);
}

async function deleteDB(conn, database) {
  return await runSql(conn, `DROP DATABASE IF EXISTS ${database}`);
}

async function useDB(conn, database) {
  return await runSql(conn, `USE ${database}`);
}

async function createTB(conn, table, value) {
  return await runSql(conn, `CREATE TABLE IF NOT EXISTS ${table} (${value})`);
}

async function deleteTB(conn, table) {
  return await runSql(conn, `DROP TABLE IF EXISTS ${table}`);
}

async function truncateTB(conn, table) {
  return await runSql(conn, `TRUNCATE TABLE IF EXISTS ${table}`);   
}

async function insertTB(conn, table, column, value) {
  return await runSql(conn, `INSERT INTO ${table} (${column}) VALUES (${value})`);
}

async function insertsTB(conn, table, column, values) {
  return await runSqlValues(conn, `INSERT INTO ${table} (${column}) VALUES ?`, values);
}

async function updateRecords(conn, table, value, where = undefined) {
  let sql = `UPDATE ${table} SET ${value}`;

  if (where != undefined) {
    sql += ` WHERE ${where}`;
  }
  return await runSql(conn, sql);
}

async function insertsTB(conn, table, column, values) {
  return await runSql(conn, `INSERT INTO ${table} (${column}) VALUES ?`, values);
}

async function selectRecords(callback, conn, table, field, where = undefined, order = undefined, limit = undefined, offset = undefined) {
  let sql = `SELECT ${field} FROM ${table}`;

  if (where != undefined) {
    sql += ` WHERE ${where}`;
  }

  if (order != undefined) {
    sql += ` ORDER BY ${order}`;
  }

  if (limit != undefined) {
    sql += ` LIMIT ${limit}`;
  }

  if (offset != undefined) {
    sql += ` OFFSET ${offset}`;
  }  

  return await runSql(conn, sql, undefined, callback);
}

async function deleteRecords(conn, table, condition = undefined) {
  let sql = `DELETE FROM ${table}`;

  if (condition != undefined) {
    sql += ` WHERE ${condition}`;
  }
  
  return await runSql(conn, sql);
}

module.exports = {connect, connectDB, closeConnect, runSql, creatDB, deleteDB, useDB, createTB, deleteTB, insertTB, insertsTB, selectRecords, deleteRecords};