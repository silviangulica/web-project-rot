CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL
    );

CREATE TABLE user_scores(
    user_id INTEGER REFERENCES users(id),
    wrong_answers INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    completed_quizzes INTEGER NOT NULL,
    total_score INTEGER NOT NULL,
    last_quiz_score INTEGER NOT NULL
    );

CREATE TABLE quizz_scores(
    user_id INTEGER REFERENCES users(id),
    quizz_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    PRIMARY KEY (user_id, quizz_id)
    );

CREATE TABLE questions(
    id SERIAL PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    image VARCHAR(255)
);

CREATE TABLE answers(
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id),
    answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL
);

CREATE TABLE quizzes(
    id SERIAL PRIMARY KEY
    --todo save encoded quizz
);

