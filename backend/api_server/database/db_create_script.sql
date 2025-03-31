CREATE TABLE users
(
    user_id serial PRIMARY KEY,
    username VARCHAR (50)  NOT NULL,
	name VARCHAR (100)  NOT NULL,
	mobile VARCHAR (50)  NOT NULL,
    user_pwd VARCHAR (100)  NULL,
    is_first_login BIT(1) DEFAULT B'0'::"bit",
    is_deleted BIT(1) DEFAULT B'0'::"bit",
	otp VARCHAR (10)  NULL,
    creation_date timestamp without time zone,
    school_id integer,
    course VARCHAR (100)  NOT NULL,
    is_counsellor BIT(1) DEFAULT B'0'::"bit",
    is_demo_user BIT(1) DEFAULT B'0'::"bit",
    CONSTRAINT username_unique UNIQUE (username)
);

CREATE TABLE personality_test
(
    q_id serial PRIMARY KEY,
    q_reference VARCHAR (5)  NOT NULL,
    question VARCHAR (1000) NOT NULL,
	q_type VARCHAR (2) NOT NULL,
    strongly_disagree INTEGER,
	little_disagree INTEGER,
	neither_agree_nor_disagree INTEGER,
	little_agree INTEGER,
	strongly_agree INTEGER,
	facet_and_correlated_trait_adjective VARCHAR (100) NOT NULL
);

CREATE TABLE career_choices
(
    user_id Integer,
    careers VARCHAR
);

CREATE TABLE career_steps
(
    career_title VARCHAR,
	first_career_steps VARCHAR
);

CREATE TABLE generated_careers
(
    user_id integer,
    qualification VARCHAR,
	personality_trait1 VARCHAR,
    personality_trait2 VARCHAR,
	career_interest1 VARCHAR,
    career_interest2 VARCHAR,
	careers VARCHAR,
    creation_date timestamp without time zone
);

CREATE TABLE preferred_careers
(
    user_id integer,
    school_id integer,
    preferred_career VARCHAR,
    course VARCHAR
);


CREATE TABLE all_career_steps
(
    career_title VARCHAR,
    qualification VARCHAR,
    step_0 VARCHAR,
	step_1 VARCHAR,
	step_2 VARCHAR,
	step_3 VARCHAR,
	step_4 VARCHAR,
	step_5 VARCHAR,
	step_6 VARCHAR,
	step_7 VARCHAR,
	step_8 VARCHAR,
    start_time timestamp without time zone,
    end_time timestamp without time zone,
	status VARCHAR
);

CREATE TABLE user_career_test_results
(
    user_id integer,
    career_test_results VARCHAR,
    creation_date timestamp without time zone
);

CREATE TABLE user_personality_test_results
(
    user_id integer,
    personality_test_results VARCHAR,
    creation_date timestamp without time zone
);

CREATE TABLE user_test_answers
(
    user_id integer,
    personality_answers VARCHAR,
    career_answers VARCHAR,
    personality_answer_date timestamp without time zone,
    career_answer_date timestamp without time zone
);

CREATE TABLE schools
(
    school_id serial PRIMARY KEY,
    school_name VARCHAR,
    student_token VARCHAR (15) UNIQUE,
    counsellor_token VARCHAR (15) UNIQUE,
    student_limit integer,
    is_demo_school BIT(1) DEFAULT B'0'::"bit"
);

CREATE TABLE courses
(
    school_id integer,
    course VARCHAR (100) NOT NULL
);

CREATE TABLE counsellor_chats
(
    counsellor_id integer,
    student_id integer,
    question1 VARCHAR,
    answer1 VARCHAR,
    question1_date timestamp without time zone,
    question2 VARCHAR,
    answer2 VARCHAR,
    question2_date timestamp without time zone,
    question3 VARCHAR,
    answer3 VARCHAR,
    question3_date timestamp without time zone
);

CREATE TABLE payments
(
    user_id integer,
    order_id varchar,
    receipt_number varchar,
    amount integer,
    razorpay_order_id varchar,
    razorpay_payment_id varchar,
    razorpay_signature varchar,
    payment_status varchar
);

CREATE TABLE user_chats
(
    user_id integer,
    chats VARCHAR,
    total_token_used integer DEFAULT 0
);

insert into users (username, user_pwd,is_first_login, creation_date)
values ('administrator','$2a$08$9QwMGg6B26F9PR145DBA3O/YJec4ghtCzEjrLpTrZx29yvRHTmv.a', '0', CURRENT_TIMESTAMP );

insert into personality_test (q_id, q_reference, question, q_type, strongly_disagree, little_disagree, neither_agree_nor_disagree, little_agree, strongly_agree, facet_and_correlated_trait_adjective) values
('1','E1','Is talkative','E','1','2','3','4','5','Warmth (outgoing)'),
('2','A1','Tends to find fault with others','A','5','4','3','2','1','Modesty (not show off)'),
('3','C1','Does a thorough job','C','1','2','3','4','5','Achievement striving (thorough)'),
('4','N1','Is depressed, blue','N','1','2','3','4','5','Depression (not contented)'),
('5','O1','Is original, comes up with new ideas','O','1','2','3','4','5','Ideas (curious)'),
('6','E2','Is reserved','E','5','4','3','2','1','Positive emotions (enthusiastic)'),
('7','A2','Is helpful and unselfish with others','A','1','2','3','4','5','Tender mindedness (sympathetic)'),
('8','C2','Can be somewhat careless','C','5','4','3','2','1','Dutifulness (not careless)'),
('9','N2','Is relaxed, handles stress well','N','5','4','3','2','1','Anxiety (tense)'),
('10','O2','Is curious about many different things','O','1','2','3','4','5','Actions (wide interests)'),
('11','E3','Is full of energy','E','1','2','3','4','5','Activity (energetic)'),
('12','A3','Starts quarrels with others','A','5','4','3','2','1','Trust (forgiving)'),
('13','C3','Is a reliable worker','C','1','2','3','4','5','Dutifulness (not careless)'),
('14','N3','Can be tense','N','1','2','3','4','5','Anxiety (tense)'),
('15','O3','Is ingenious, a deep thinker','O','1','2','3','4','5','Ideas (curious)'),
('16','E4','Generates a lot of enthusiasm','E','1','2','3','4','5','Positive emotions (enthusiastic)'),
('17','A4','Has a forgiving nature','A','1','2','3','4','5','Trust (forgiving)'),
('18','C4','Tends to be disorganised','C','5','4','3','2','1','Order (organized)'),
('19','N4','Worries a lot','N','1','2','3','4','5','Angry hostility (irritable)'),
('20','O4','Has an active imagination','O','1','2','3','4','5','Fantasy (imaginative)'),
('21','E5','Tends to be quiet','E','5','4','3','2','1','Assertiveness (forceful)'),
('22','A5','Is generally trusting','A','1','2','3','4','5','Compliance (not stubborn)'),
('23','C5','Tends to be lazy','C','5','4','3','2','1','Self discipline (not lazy)'),
('24','N5','Is emotionall stable, not easily upset','N','5','4','3','2','1','Vulnerability (not self confident)'),
('25','O5','Is inventive','O','1','2','3','4','5','Actions (wide interests)'),
('26','E6','Has an assertive personality','E','1','2','3','4','5','Assertiveness (forceful)'),
('27','A6','Can be cold and aloof','A','5','4','3','2','1','Altruism (warm)'),
('28','C6','Perseveres until the task is finished','C','1','2','3','4','5','Achievement striving (thorough)'),
('29','N6','Can be moody','N','1','2','3','4','5','Impulsiveness (moody)'),
('30','O6','Values artistic, aesthetic experiences','O','1','2','3','4','5','Aesthetics (artistic)'),
('31','E7','Is sometimes shy, inhibited','E','5','4','3','2','1','Gregariousness (sociable)'),
('32','A7','Is considerate and kind to almost everyone','A','1','2','3','4','5','Compliance (not stubborn)'),
('33','C7','Does things efficiently','C','1','2','3','4','5','Competence (efficient)'),
('34','N7','Remains calm in tense situations','N','5','4','3','2','1','Anxiety (tense)'),
('35','O7','Prefers to work that is routine','O','5','4','3','2','1','Values (unconventional)'),
('36','E8','Is outgoing, sociable','E','1','2','3','4','5','Warmth (outgoing)'),
('37','A8','Is sometines rude to others','A','5','4','3','2','1','Straightforwardness (not demanding)'),
('38','C8','Makes plans and follows through with them','C','1','2','3','4','5','Order (organized)'),
('39','N8','Gets nervous easily','N','1','2','3','4','5','Impulsiveness (moody)'),
('40','O8','Likes to reflect, play with ideas','O','1','2','3','4','5','Fantasy (imaginative)'),
('41','O9','Has few artistic interests','O','5','4','3','2','1','Aesthetics (artistic)'),
('42','A9','Likes to cooperate with others','A','1','2','3','4','5','Compliance (not stubborn)'),
('43','C9','Is easily distracted','C','5','4','3','2','1','Deliberation (not impulsive)'),
('44','O10','Is sophisticated in art, music or literature','O','1','2','3','4','5','Feelings (excitable)');


CREATE TABLE personality_test_50
(
    q_id serial PRIMARY KEY,
    q_category VARCHAR (5)  NOT NULL,
    question VARCHAR (1000) NOT NULL
);

insert into personality_test_50 (q_id, q_category, question) values 
('1','E','In social gatherings, I tend to bring energy and enthusiasm, often making people around me feel lively and engaged.'),
('2','A','I often find it challenging to consider the feelings and needs of others.'),
('3','C','I tend to stay ready for most situations, often having what I need ahead of time.'),
('4','N','I tend to feel stressed out quite easily in certain situations.'),
('5','O','I find myself using a wide range of words or expressions when I talk or write about different topics.'),
('6','E','I tend to be more reserved in conversations, often choosing to listen rather than speak up frequently.'),
('7','A','I find it fascinating to learn about different individuals, often curious about their experiences and perspectives.'),
('8','C','I am comfortable leaving my belongings around rather than organized in one spot.'),
('9','N','In many situations, I tend to stay calm, composed, and relaxed.'),
('10','O','I often find it challenging to grasp or relate to things that are conceptual only when learning or discussing certain topics.'),
('11','E','I generally find it easy to be in social settings, feeling at ease and relaxed.'),
('12','A','I unintentionally say things that may hurt or upset others without realizing it.'),
('13','C','I often notice small things that others might overlook.'),
('14','N','I feel I worry about things or situations a lot.'),
('15','O','I often find myself creating detailed mental images or scenarios, imagining various possibilities or stories in my mind.'),
('16','E','I like to stay more in the background, preferring to observe rather than be at the front.'),
('17','A','I often sympathize the emotions or experiences of others.'),
('18','C','I sometimes find myself creating disorder or confusion.'),
('19','N','Feeling down or sad is a rare occurrence for me.'),
('20','O','I''m generally not interested in abstract ideas and I feel they are waste of time'),
('21','E','I often take the initiative to begin conversations or discussions.'),
('22','A','I struggle to engage deeply with other people''s issues or problems.'),
('23','C','I often tackle tasks promptly, preferring to get chores or assignments done without delay.'),
('24','N','I frequently encounter distractions or disturbances that impact my focus.'),
('25','O','I often come up with creative or innovative thoughts and suggestions in different situations.'),
('26','E','Most often, I have much less to say compared to others.'),
('27','A','I am deeply empathetic towards others'' emotions.'),
('28','C','I often forget to put things back in their proper place.'),
('29','N','I tend to get upset very easily.'),
('30','O','I find it challenging to imagine or picture things vividly.'),
('31','E','I like to engage in conversations with various individuals when I''m at parties or social events.'),
('32','A','I generally lack interest or involvement in the lives and experiences of others.'),
('33','C','I prefer things to be organized and structured.'),
('34','N','My emotional state tends to change or fluctuate often.'),
('35','O','I often grasp or comprehend things swiftly.'),
('36','E','I don''t like to draw attention to myself.'),
('37','A','Creating space and time to support others is something I often do.'),
('38','C','I sometimes tend to run away from things that I am expected to do.'),
('39','N','Rapid or frequent shifts in my moods or emotions are quite common.'),
('40','O','I often use complex or challenging words when I speak or write.'),
('41','E','I feel comfortable or okay being in the spotlight.'),
('42','A','I often sense the feelings or emotions of others.'),
('43','C','I mostly stick to or adhere to a planned routine.'),
('44','N','I''m easily irked or unsettled by various situations.'),
('45','O','I often take moments to reflect or think deeply about various things.'),
('46','E','When around strangers, I tend to be more quiet.'),
('47','A','I frequently assist others in feeling at ease or comfortable.'),
('48','C','I pay close attention to details in the work or tasks I undertake.'),
('49','N','At times, I face moments of sadness or feeling low.'),
('50','O','I feel coming up with ideas or thoughts is natural to me.');


CREATE TABLE career_test
(
    q_id serial PRIMARY KEY,
    question VARCHAR (1000) NOT NULL,
	riasec_type VARCHAR (20) NOT NULL
);

insert into career_test (q_id, question,riasec_type) values 
('1','Build kitchen for a large restaurant','Realistic'),
('2','Test the quality of electronic or automobile products','Realistic'),
('3','Develop a new medicine to cure cancer','Investigative'),
('4','Study ways to reduce river pollution','Investigative'),
('5','Write books or plays','Artistic'),
('6','Play musical instruments in a concert','Artistic'),
('7','Teach an individual or a group an exercise routine like Yoga or Aerobics','Social'),
('8','Provide counselling to people with personal or emotional problems','Social'),
('9','Buy and sell stocks and bonds','Enterprising'),
('10','Manage an outlet of a clothing brand or a mobile shoppee','Enterprising'),
('11','Set up an accounting spreadsheet for a business','Conventional'),
('12','Operate a medical store or a pharmacy','Conventional'),
('13','Provide repair services for household applicances like TV, washing machine','Realistic'),
('14','Set up a cattle or poultry farm','Realistic'),
('15','Conduct chemical experiments to discover a new compound','Investigative'),
('16','Study the movement of planets','Investigative'),
('17','Write lyrics for a music album','Artistic'),
('18','Perform jazz or tap dance','Artistic'),
('19','Give career guidance to people','Social'),
('20','Do volunteer work at a non-profit organization','Social'),
('21','Start your own business','Enterprising'),
('22','Set up your startup that addresses an unsolved problem','Enterprising'),
('23','Install software across computers on a large network','Conventional'),
('24','Operate a software to manage inventories','Conventional'),
('25','Assemble an electric scooter','Realistic'),
('26','Repair computer latops and electronic gadgets','Realistic'),
('27','Develop a way to better predict flood','Investigative'),
('28','Invent an alternative to sugar','Investigative'),
('29','Create special effects for movies','Artistic'),
('30','Design interior of a house or an office','Artistic');

<!--INSERT INTO schools (school_name,student_token,counsellor_token,student_limit) VALUES ('DEMO', UPPER(substr(md5(random()::text), 1, 10)), UPPER(substr(md5(random()::text), 1, 10)),50);-->
