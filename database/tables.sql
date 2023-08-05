DROP TABLE IF EXISTS "user";

DROP TABLE IF EXISTS "preparador";

DROP TABLE IF EXISTS "prenuevo";

CREATE TABLE "user" (
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

CREATE TABLE "preparador" (
    user_id SERIAL NOT NULL UNIQUE,
    telegram_id BIGINT UNIQUE,
    telegram_firstname VARCHAR(50),
    telegram_lastname VARCHAR(50),
    telegram_username VARCHAR(50),
    initials VARCHAR(2),
    carnet VARCHAR(10),
    PRIMARY KEY (telegram_id)
);

CREATE TABLE "prenuevo" (
    user_id SERIAL NOT NULL UNIQUE,
    telegram_id BIGINT UNIQUE,
    telegram_firstname VARCHAR(50),
    telegram_lastname VARCHAR(50),
    telegram_username VARCHAR(50),
    carnet VARCHAR(10),
    PRIMARY KEY (telegram_id)
)
