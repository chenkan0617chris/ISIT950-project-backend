create database ClickNCrave;
use ClickNCrave;

create table customers (
	cid int primary key auto_increment,
    username char(30) not null unique,
    password char(50) not null,
	name char(30) not null,
    phone char(15) not null,
    email char(30),
    membership bool default false,
    membership_expire_date datetime,
    address char(50) not null,
    postcode int not null,
    balance decimal(10,2) default 1000
);

create table restaurants (
	rid int primary key auto_increment,
	username char(30) not null unique,
    password char(50) not null,
    title char(30) not null unique,
    phone char(15) not null,
    email char(30),
    image text(500),
    description text(500),
    address char(50) not null,
    postcode int not null,
    category char(20),
    rate decimal(1,2)
);

create table deliverypersons (
	did int primary key auto_increment,
	username char(30) not null unique,
    password char(50) not null,
    phone char(15) not null,
    email char(30),
    address char(50),
    postcode int not null
);

create table menus (
	mid int primary key auto_increment,
    restaurant_id int not null,
    name char(50) not null,
    price decimal(10,2) not null,
    dishImage text(500),
    description text(500) not null,
    available bool default true,
    constraint foreign key(restaurant_id) references restaurants(rid)
);

create table orders (
	oid int primary key auto_increment,
    customer_id int not null,
    restaurant_id int not null,
    items text(500) not null,
    total_price decimal(10,2) not null,
    order_time datetime not null,
    estimate_time int,
    finish_time datetime,
    status char(20) not null,
    rate int,
	constraint foreign key(customer_id) references customers(cid),
	constraint foreign key(restaurant_id) references restaurants(rid)
);

create table delivery (
	id int primary key auto_increment,
    order_id int not null,
    deliveryperson_id int not null,
	constraint foreign key(order_id) references orders(oid),
	constraint foreign key(deliveryperson_id) references deliverypersons(did)
);