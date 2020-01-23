DROP TABLE IF EXISTS USERS;

DROP TABLE IF EXISTS PREPARADOR;

CREATE TABLE USERS (
    user_id SERIAL NOT NULL UNIQUE,
    telegram_id BIGINT UNIQUE,
    telegram_firstname VARCHAR(50),
    telegram_lastname VARCHAR(50),
    telegram_username VARCHAR(50),
    name VARCHAR(50),
    carnet VARCHAR(10),
    phone INT,
    PRIMARY KEY (telegram_id)
);

CREATE TABLE PREPARADOR (
    user_id SERIAL NOT NULL UNIQUE,
    telegram_id BIGINT UNIQUE,
    telegram_firstname VARCHAR(50),
    telegram_lastname VARCHAR(50),
    telegram_username VARCHAR(50),
    PRIMARY KEY (telegram_id)
);