# BackEnd

==================================================

ACTUALIZACIÓN: EL MODELO DE unwallet_db YA ESTÁ OBSOLETO!
Para ejecutar la base de datos, instalar sequelize:

> npm install sequelize --save

Luego:

> npm install mysql2 --save

Y también instalar la cli:

npm install sequelize-cli -g

Ahora se inicia el servidor de mysql en el localhost,
se entra a mysql por la consola, y se crea la base
con el nombre "db_unwallet":

> mysql -u root -p
> *Se pone la contraseña que se tenga para root*
> create database db_unwallet;

Pro último se ejecuta el comando, en cmd (powershell
puede causa más problemas al ejecutarlo):

>sequelize db:migrate

Así todas las migraciones no ejecutadas se van a 
ejecutar sobre la db. 

Tener en cuenta el usuario y contraseña de mysql 
en el archivo config/config.js en la parte de 
development!

==================================================