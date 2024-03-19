DROP TABLE IF EXISTS "user";

DROP TABLE IF EXISTS "preparador";

DROP TABLE IF EXISTS "prenuevo";

DROP TABLE IF EXISTS "invitado_mas";

CREATE TABLE "user" (
    user_id SERIAL NOT NULL UNIQUE,
    telegram_id BIGINT UNIQUE,
    telegram_firstname VARCHAR(50),
    telegram_lastname VARCHAR(50),
    telegram_username VARCHAR(50),
    PRIMARY KEY (telegram_id)
);

CREATE TABLE "preparador" (
    user_id SERIAL NOT NULL UNIQUE,
    telegram_id BIGINT UNIQUE,
    initials VARCHAR(3) UNIQUE,
    PRIMARY KEY (telegram_id)
);

CREATE TABLE "prenuevo" (
    user_id SERIAL NOT NULL UNIQUE,
    telegram_id BIGINT UNIQUE,
    name VARCHAR(50),
    carnet VARCHAR(10) UNIQUE,
    PRIMARY KEY (telegram_id)
);

CREATE TABLE "invitado_mas" (
    user_id SERIAL NOT NULL UNIQUE,
    telegram_id BIGINT UNIQUE,
    name VARCHAR(50) UNIQUE,
    checked BOOLEAN DEFAULT false,
    team VARCHAR(50) DEFAULT 'None',
    suggestion VARCHAR(200) DEFAULT '',
    receive VARCHAR(50) DEFAULT 'None',
    PRIMARY KEY (telegram_id)
);
