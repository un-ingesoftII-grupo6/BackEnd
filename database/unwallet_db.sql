/*

==================================================
ACTUALIZACIÓN: ESTE MODELO YA ESTÁ OBSOLETO!
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

*/
DROP DATABASE IF EXISTS unwallet_db;

CREATE DATABASE unwallet_db;

USE unwallet_db;

/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     12/04/2020 9:35:51 p. m.                     */
/*==============================================================*/


drop table if exists BANK;

drop table if exists ENTERPRISE;

drop table if exists MOVEMENT;

drop table if exists TRANSFER;

drop table if exists USER;

drop table if exists WALLET;

drop table if exists WALLET_TYPE;

/*==============================================================*/
/* Table: BANK                                                  */
/*==============================================================*/
create table BANK
(
   BANK_NAME            char(60) not null,
   BANK_DESCRIPTION     text not null,
   BANK_IS_AUTHORIZED   bool not null,
   BANK_MONTH_LIMIT     double,
   BANK_TRANSFER_LIMIT  double,
   primary key (BANK_NAME)
);

/*==============================================================*/
/* Table: ENTERPRISE                                            */
/*==============================================================*/
create table ENTERPRISE
(
   ENT_NIT              char(25) not null,
   ENT_NAME             varchar(50) not null,
   ENT_BUDGET           double not null,
   ENT_USERNAME         varchar(25) not null,
   ENT_PASSWORD         varchar(60) not null,
   primary key (ENT_NIT)
);

/*==============================================================*/
/* Table: MOVEMENT                                              */
/*==============================================================*/
create table MOVEMENT
(
   TRA_ID               int not null,
   WAL_ID              char(32) not null,
   MOV_SENDER           char(25) not null,
   MOV_RECIPIENT        char(25) not null,
   MOV_TOTAL_AMOUNT     double not null,
   MOV_DATE             varchar(10) not null,
   MOV_TIME             varchar(5) not null,
   MOV_IS_SUCCESSFUL    tinyint not null,
   MOV_TIMESTAMP        timestamp,
   primary key (TRA_ID, WAL_ID)
);

/*==============================================================*/
/* Table: TRANSFER                                              */
/*==============================================================*/
create table TRANSFER
(
   TRA_ID               int not null auto_increment,
   BANK_NAME            char(60),
   TRA_NAME             varchar(30) not null,
   TRA_DESCRIPTION      text not null,
   TRA_INTEREST_RATE    smallint not null,
   primary key (TRA_ID)
);

/*==============================================================*/
/* Table: USER                                                  */
/*==============================================================*/
create table USER
(
   USR_ID               bigint not null,
   USR_NAME             varchar(30) not null,
   USR_SURNAME          varchar(30) not null,
   USR_EMAIL            varchar(40) not null,
   USR_USERNAME         varchar(25) not null,
   USR_PASSWORD         varchar(60) not null,
   primary key (USR_ID)
);

/*==============================================================*/
/* Table: WALLET                                                */
/*==============================================================*/
create table WALLET
(
   WAL_ID              char(40) not null,
   USR_ID               bigint not null,
   WTYP_ID              int not null,
   ENT_NIT              char(25),
   WAL_BALANCE          double not null,
   WAL_STATE            varchar(10) not null,
   primary key (WAL_ID)
);

/*==============================================================*/
/* Table: WALLET_TYPE                                           */
/*==============================================================*/
create table WALLET_TYPE
(
   WTYP_ID              int not null auto_increment,
   WTYP_NAME            varchar(30) not null,
   WTYP_DESCRIPTION     text not null,
   WTYP_MOVEMENT_LIMIT  double not null,
   WTYP_MONTH_LIMIT     double not null,
   primary key (WTYP_ID)
);

/* ADICIONALES*/
/*
ALTER TABLE USER
    MODIFY USR_ID BIGINT NOT NULL AUTO_INCREMENT;

/*------------*/

alter table MOVEMENT add constraint FK_IS_GIVEN foreign key (TRA_ID)
      references TRANSFER (TRA_ID) on delete restrict on update restrict;

alter table MOVEMENT add constraint FK_MODIFIES foreign key (WAL_ID)
      references WALLET (WAL_ID) on delete restrict on update restrict;

alter table TRANSFER add constraint FK_IS_AUTHORIZED foreign key (BANK_NAME)
      references BANK (BANK_NAME) on delete restrict on update restrict;

alter table WALLET add constraint FK_GIVE_ROLES foreign key (WTYP_ID)
      references WALLET_TYPE (WTYP_ID) on delete restrict on update restrict;

alter table WALLET add constraint FK_MANAGES foreign key (ENT_NIT)
      references ENTERPRISE (ENT_NIT) on delete restrict on update restrict;

alter table WALLET add constraint FK_POSSESS foreign key (USR_ID)
      references USER (USR_ID) on delete restrict on update restrict;

INSERT INTO WALLET_TYPE (WTYP_ID, WTYP_NAME, WTYP_DESCRIPTION,WTYP_MOVEMENT_LIMIT, WTYP_MONTH_LIMIT)
   VALUES (1,"Personal Wallet","This is a personal wallet",16000000.0,8000000.0);
   