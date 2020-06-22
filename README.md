# BackEnd

==================================================

 # Actualización 200621

 Se crearon nuevos scripts, más que todo para manejar
 mejor las pruebas y las migraciones. Ahora se puede:

 Migrar a la base de datos

 > npm run migrate

 Reemplazar las migraciones antiguas con las que se
 encuentren en la aplicación

 > npm run migrate:reset

 ### Para hacer los tests

IMPORTANTE: Se debe crear la respectiva base de datos
para los tests en mysql (el nombre que viene por
defecto para la base es **database_test**)

 Se ejecuta primero pretest

> npm run pretest

Y luego, se puede ejecutar un análisis de todas las
pruebas con su /coverage con:

> npm test

O se puede ejecutar pruebas en tiempo real cada vez
que se actualiza alguno de los archivos con:

> npm run test:watch

### Configuración .gitignore

Para quitar las carpetas que ya están el el repo,
pero deben ser quitadas de este, se usa:

>git rm -r --cached (nombre de la carpeta)

Con esto se asegura que, aunque se elimine del repo,
no se borre de nuestro equipo

### Configuración global

Para ejecutar la base de datos, instalar sequelize:

En primer lugar, es necesario instalar los módulos
necesarios

> npm install

Si es necesario, instalar sequelize por separado:

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
puede causar más problemas al ejecutarlo):

> (npx) sequelize db:migrate

Así todas las migraciones no ejecutadas se van a 
ejecutar sobre la db. 

Tener en cuenta el usuario y contraseña de mysql 
en el archivo config/config.js, el cual se debe 
cambiar a como sea la configuración de cada pc.

==================================================