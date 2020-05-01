# BackEnd

==================================================

ACTUALIZACIÓN: EL MODELO DE unwallet_db YA ESTÁ OBSOLETO!
Para ejecutar la base de datos, instalar sequelize:

> npm install sequelize --save

Luego:

> npm install mysql2 --save

Y también instalar la cli:

npm install sequelize-cli -g

Por último se entra a mysql por cmd, se crea la base
con el nombre "db_unwallet" y se ejecuta el comando:

>sequelize db:migrate

Así todas las migraciones no ejecutadas se van a 
ejecutar sobre la db. 

Tener en cuenta el usuario y contraseña de mysql 
en el archivo config/config.js en la parte de 
development!

==================================================