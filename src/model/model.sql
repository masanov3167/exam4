-- 1) databaza yaratmiz
CREATE DATABASE masanov;

-- 2) databazaga kiramiz
\c masanov;

-- 3) users nomli table ochamiz
   -- userlarning rollari:
   -- 1: oddiy user
   -- 2: sotuvchi
   -- 3: mahsulot qo'shadigan admin
   -- 4: super admin qo'lidan har balo keladigani 

DROP TABLE IF EXISTS users;
CREATE TABLE users (      
	id serial PRIMARY KEY, 
    name text not null, 
	login text not null,
    parol text not null,
    phone text,
    tgId int,
    role int default 1
);

-- 4) super admin qo'shamiz ixtiyoriy yodda qoladigan login va parol ham yaratamiz
insert into users(name, login, parol, role) values('adminjon', 'adminjon','Adminjon1234', 4);

-- 4) kategoriyalar uchun 'category' nomli table yaratamiz

DROP TABLE IF EXISTS category;
CREATE TABLE category (      
	id serial PRIMARY KEY, 
    name_uz text not null, 
    name_oz text not null, 
    name_ru text not null, 
	route text not null,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5) kategoriya qo'shish uchun namuna 

insert into category(name_oz, name_ru, name_uz, route) values('Болалар дунёси', 'Детский мир', 'Bolalar dunyosi', 'bolalar-dunyosi');

-- 6) mediani boshqarish uchun media degan table ochamiz
DROP TABLE IF EXISTS media;
CREATE TABLE media (      
	id serial PRIMARY KEY,  
	url text not null,
    mimetype text not null,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7) productlar uchun products degan table ochamiz
DROP TABLE IF EXISTS products;
CREATE TABLE products (      
	id serial PRIMARY KEY, 
    name_uz text not null, 
    name_oz text not null, 
    name_ru text not null,
    body_uz json not null, 
    body_oz json not null, 
    body_ru json not null,
    price int not null,
    money_for_seller int,
    kod text,
    admin_id int,
    isArchive boolean default false,
    discount int,
    pic text not null,
	category_id int,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    foreign key (category_id) REFERENCES category(id) on delete cascade,
    foreign key (admin_id) REFERENCES users(id)
);

-- 8) referal havolalar uchun referal degan table ochamiz 
DROP TABLE IF EXISTS referal;
CREATE TABLE referal (      
	id serial PRIMARY KEY, 
    title text not null, 
	product_id int,
	admin_id int,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    foreign key (product_id) REFERENCES products(id) on delete cascade,
    foreign key (admin_id) REFERENCES users(id) on delete cascade
);

-- 9) news nomli table yaratamiz yangiliklarni berib borish uchun 
DROP TABLE IF EXISTS news;
CREATE TABLE news (      
	id serial PRIMARY KEY, 
    title_uz text not null, 
    title_oz text not null, 
    title_ru text not null,
    body_uz json not null, 
    body_oz json not null, 
    body_ru json not null,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);