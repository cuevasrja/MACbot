CREATE DATABASE macbot;

CREATE USER macbot_user PASSWORD 'macbot_password';

GRANT ALL PRIVILEGES ON DATABASE macbot TO macbot_user;

ALTER DATABASE macbot OWNER TO macbot_user;
