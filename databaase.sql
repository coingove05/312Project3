CREATE TABLE users (
user_id VARCHAR(255) PRIMARY KEY,
password VARCHAR(255) NOT NULL,
name VARCHAR(255) NOT NULL
);

CREATE TABLE blogs (
blog_id SERIAL PRIMARY KEY,
creator_name VARCHAR(255) NOT NULL,
creator_user_id VARCHAR(255) NOT NULL, 
title VARCHAR(255) NOT NULL, 
body TEXT NOT NULL, 
date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_blog_creator
	FOREIGN KEY (creator_user_id)
	REFERENCES users(user_id)
	ON DELETE CASCADE
);

INSERT INTO users (user_id, password, name)
VALUES
	('tim42', 'password123', 'Tim'),
	('luke86', 'mydog78', 'Luke'),
	('dom57', 'Ilikepizza', 'Dom');


INSERT INTO blogs(creator_name, creator_user_id, title, body, date_created)
VALUES
	(
		'Tim',
		'tim42',
		'I went to a baseball game',
		'Last week I went to the baseball game',
		'2026-10-5 10:00:00'
	),
	(
		'Luke',
		'luke86',
		'I went fishing tody',
		'I went fising today at the lake and got a big bass',
		'2026-10-12 06:00:00'
	),
	(
		'Dom',
		'dom57',
		'I had a great pizza today at joes!',
		'I had a great meat pizza at joes today!, it was thin crust, 10/10',
		'2026-10-12 17:00:00'
	),
	(
		'Tim',
		'tim42',
		'I got in a car accident',
		'someone totaled my honda civic and it was very annoying',
		'2026-09-12 10:00:00'
	),
	(
		'Luke',
		'luke86',
		'Todays church service was great',
		'todays church service was excellent, It was very well done and welcoming',
		'2026-10-10 06:00:00'
	);

SELECT * 
FROM blogs
ORDER BY date_created DESC;

SELECT * FROM blogs;




		