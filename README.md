# lookforparty
webapp for finding and posting group activity that wanted members or could not find one

for installation you need mysql 
https://www.mysql.com/

and node.js
https://nodejs.org/en

after cloning repository
open IDE -> ex visual studio code 
https://code.visualstudio.com/

install extension
Javascript (ES6)
ES7+ React
HTML CSS support

create schema and table 
look for ../lookforparty/etc-noncodebase/sql for sql file 

configs at ../lookforparty/backend/connect.js
here you will need to change the db setting to match your sql server

export const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database:"party"
});

change your db -> host(defalut "localhost") , user(defalut "root") , password , database(defalut if use prebuild sqlfile "party")

to start 
open 2 terminal 
1 -> cd/backend
2 -> cd/client

and npm start 
on both terminal

right now the webbaseapplication is not supporting hosting on the web

enjoy


