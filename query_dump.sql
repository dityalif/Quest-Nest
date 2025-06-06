--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: badges; Type: TABLE; Schema: public; Owner: questnest-be_owner
--

CREATE TABLE public.badges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    condition text
);


ALTER TABLE public.badges OWNER TO "questnest-be_owner";

--
-- Name: challenge_participants; Type: TABLE; Schema: public; Owner: questnest-be_owner
--

CREATE TABLE public.challenge_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    challenge_id uuid,
    user_id uuid,
    team_id uuid,
    status character varying(20) DEFAULT 'ongoing'::character varying,
    completed_at timestamp without time zone,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.challenge_participants OWNER TO "questnest-be_owner";

--
-- Name: challenges; Type: TABLE; Schema: public; Owner: questnest-be_owner
--

CREATE TABLE public.challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(100) NOT NULL,
    description text,
    category character varying(50),
    difficulty character varying(20),
    points integer DEFAULT 0,
    type character varying(10),
    deadline date,
    creator_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT challenges_difficulty_check CHECK (((difficulty)::text = ANY ((ARRAY['Easy'::character varying, 'Medium'::character varying, 'Hard'::character varying])::text[]))),
    CONSTRAINT challenges_type_check CHECK (((type)::text = ANY ((ARRAY['individu'::character varying, 'tim'::character varying])::text[])))
);


ALTER TABLE public.challenges OWNER TO "questnest-be_owner";

--
-- Name: leaderboards; Type: TABLE; Schema: public; Owner: questnest-be_owner
--

CREATE TABLE public.leaderboards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type character varying(10),
    reference_id uuid,
    xp integer DEFAULT 0,
    period character varying(20),
    CONSTRAINT leaderboards_type_check CHECK (((type)::text = ANY ((ARRAY['user'::character varying, 'team'::character varying])::text[])))
);


ALTER TABLE public.leaderboards OWNER TO "questnest-be_owner";

--
-- Name: team_challenges; Type: TABLE; Schema: public; Owner: questnest-be_owner
--

CREATE TABLE public.team_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    team_id uuid,
    challenge_id uuid,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.team_challenges OWNER TO "questnest-be_owner";

--
-- Name: team_members; Type: TABLE; Schema: public; Owner: questnest-be_owner
--

CREATE TABLE public.team_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    team_id uuid,
    user_id uuid,
    role character varying(20) DEFAULT 'member'::character varying,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.team_members OWNER TO "questnest-be_owner";

--
-- Name: teams; Type: TABLE; Schema: public; Owner: questnest-be_owner
--

CREATE TABLE public.teams (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    creator_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    xp integer DEFAULT 0,
    xp_weekly integer DEFAULT 0,
    xp_monthly integer DEFAULT 0
);


ALTER TABLE public.teams OWNER TO "questnest-be_owner";

--
-- Name: user_badges; Type: TABLE; Schema: public; Owner: questnest-be_owner
--

CREATE TABLE public.user_badges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    badge_id uuid,
    earned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    progress integer DEFAULT 0
);


ALTER TABLE public.user_badges OWNER TO "questnest-be_owner";

--
-- Name: users; Type: TABLE; Schema: public; Owner: questnest-be_owner
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password text NOT NULL,
    xp integer DEFAULT 0,
    level integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    xp_weekly integer DEFAULT 0,
    xp_monthly integer DEFAULT 0,
    username character varying(50),
    avatar text
);


ALTER TABLE public.users OWNER TO "questnest-be_owner";

--
-- Data for Name: badges; Type: TABLE DATA; Schema: public; Owner: questnest-be_owner
--

COPY public.badges (id, name, description, condition) FROM stdin;
5fc167e6-152e-47f7-be90-20831fe557b4	Challenge Master	Selesaikan 20 challenge.	complete_20_challenges
b7cd2c10-56a1-4154-84bc-41fefcb8a940	First Blood	Selesaikan challenge pertama.	first_challenge_completed
953f34c5-2db5-47f8-90f2-ede423f83d40	Social Butterfly	Bergabung dengan 3 tim berbeda.	join_3_teams
c6b23de9-dc1e-4678-877e-b0f02afd7653	Remontada	Selesaikan challenge setelah 7 hari tidak aktif.	comeback_after_7_days_inactive
1f4aab5a-fbc6-47c9-9ccb-985cbd0f78dd	Ancestor	Membuat tim baru.	create_team
020c7a1a-825b-457e-8db8-afa8041b9d51	Api Woi Api	Selesaikan challenge selama 7 hari berturut-turut.	complete_challenge_7_days_streak
\.


--
-- Data for Name: challenge_participants; Type: TABLE DATA; Schema: public; Owner: questnest-be_owner
--

COPY public.challenge_participants (id, challenge_id, user_id, team_id, status, completed_at, joined_at) FROM stdin;
1718a57b-5137-481b-b2b6-4655b14524fd	a81e460a-7192-405b-95d0-2a5b2867c278	cfa6ca70-e230-4dc4-9dd2-e1431f5b1eed	\N	completed	2025-05-18 16:59:15.458249	2025-05-18 16:07:39.997166
b05960dd-a653-42e6-96a4-3b45b815e168	a81e460a-7192-405b-95d0-2a5b2867c278	cfa6ca70-e230-4dc4-9dd2-e1431f5b1eed	\N	completed	2025-05-18 16:59:15.458249	2025-05-18 16:46:07.144991
ae719ad7-5501-4c9c-ba6b-6ccfcdd38abd	da7fa585-a994-42f2-9ecb-e798a3090fa3	cfa6ca70-e230-4dc4-9dd2-e1431f5b1eed	\N	completed	2025-05-18 16:59:27.030063	2025-05-18 16:59:22.503775
a1f93bb2-e186-49eb-8262-a62874b961fe	a81e460a-7192-405b-95d0-2a5b2867c278	8363c764-064d-4a95-95d9-1a1cc52f5b04	\N	completed	2025-05-18 22:51:53.694485	2025-05-18 22:51:45.992456
23749a4e-2111-4c1f-8cee-5314927189b3	da7fa585-a994-42f2-9ecb-e798a3090fa3	a5163add-7d79-4b8e-9e20-8016995deebc	\N	completed	2025-05-19 03:07:37.363755	2025-05-19 03:07:32.546355
b373d44a-5b5a-49b1-903b-2de859405198	3fec03e1-87e0-4a33-8411-5bca5ce6ed71	cfa6ca70-e230-4dc4-9dd2-e1431f5b1eed	\N	completed	2025-05-19 03:16:57.446245	2025-05-19 03:16:48.96581
d2405dab-fc13-41fa-abfb-be319c5fda36	3fec03e1-87e0-4a33-8411-5bca5ce6ed71	a5163add-7d79-4b8e-9e20-8016995deebc	\N	completed	2025-05-19 03:53:56.368102	2025-05-19 03:53:52.417227
113f01a7-7fa9-47a9-9e58-7cc5d985ecee	da7fa585-a994-42f2-9ecb-e798a3090fa3	48ec3e05-6be1-44fd-aa73-c00a45bac6ea	\N	completed	2025-05-19 05:31:29.814567	2025-05-18 11:13:28.733068
e2c6c983-6f68-4064-b21b-724a181590ad	da7fa585-a994-42f2-9ecb-e798a3090fa3	48ec3e05-6be1-44fd-aa73-c00a45bac6ea	\N	completed	2025-05-19 05:31:29.814567	2025-05-18 11:14:01.354214
10207960-cd1d-4970-9a47-6dc5b441fb6a	a81e460a-7192-405b-95d0-2a5b2867c278	48ec3e05-6be1-44fd-aa73-c00a45bac6ea	\N	completed	2025-05-19 05:31:36.739591	2025-05-18 11:08:29.683687
25249bb9-563c-4a03-abe1-5df408f500db	da7fa585-a994-42f2-9ecb-e798a3090fa3	b40040f2-678e-44a1-9fca-b07caa3cbfeb	\N	completed	2025-05-19 10:41:50.435649	2025-05-19 10:41:45.280941
00e3b5c6-9e19-4378-9ca6-126c628dc8e0	a81e460a-7192-405b-95d0-2a5b2867c278	a5163add-7d79-4b8e-9e20-8016995deebc	\N	completed	2025-05-20 07:41:57.381455	2025-05-20 07:41:53.179357
c81fb759-f54b-4b3c-b749-12f80c12e1f5	da7fa585-a994-42f2-9ecb-e798a3090fa3	8363c764-064d-4a95-95d9-1a1cc52f5b04	\N	completed	2025-05-20 09:30:47.170748	2025-05-20 09:30:26.417269
f0abfa42-4425-4540-9158-711f9c173ab6	3fec03e1-87e0-4a33-8411-5bca5ce6ed71	b40040f2-678e-44a1-9fca-b07caa3cbfeb	\N	completed	2025-05-20 11:15:54.912432	2025-05-19 12:09:24.758196
950ba8f5-f3d8-461d-bd9b-2cdccf22fa1d	927094d1-80ef-427b-8ce7-32a3988d0f63	48ec3e05-6be1-44fd-aa73-c00a45bac6ea	\N	completed	2025-05-20 11:39:35.762581	2025-05-20 11:39:27.721457
e1380d85-062c-422e-b211-4593b948f8cf	3fec03e1-87e0-4a33-8411-5bca5ce6ed71	8363c764-064d-4a95-95d9-1a1cc52f5b04	\N	completed	2025-05-20 14:56:26.925888	2025-05-20 14:56:21.721061
70c4bc80-fd20-4083-830a-15b5f2da5074	3fec03e1-87e0-4a33-8411-5bca5ce6ed71	48ec3e05-6be1-44fd-aa73-c00a45bac6ea	\N	completed	2025-05-20 16:02:56.71389	2025-05-20 16:02:45.501015
ab149b0d-4609-4192-8adf-4d27ce5c86b9	3fec03e1-87e0-4a33-8411-5bca5ce6ed71	48ec3e05-6be1-44fd-aa73-c00a45bac6ea	\N	completed	2025-05-20 16:02:56.71389	2025-05-20 16:02:49.113639
ea47fe15-2ab8-4fc3-9aa5-87e552ef7ace	2c00f83c-3fda-4118-ba10-6ccaafd07551	48ec3e05-6be1-44fd-aa73-c00a45bac6ea	\N	completed	2025-05-20 16:16:13.388701	2025-05-20 16:14:45.787467
44e847e0-5cb7-407b-959c-50a4013679b5	c1b046ef-c6b3-4f5d-80fa-ba3b74e7cb49	48ec3e05-6be1-44fd-aa73-c00a45bac6ea	\N	completed	2025-05-20 16:16:16.642629	2025-05-20 16:14:47.679396
e628316e-b301-4a28-9c7d-4bc8ed81e765	3c05f764-50cc-4d58-b412-a5a5551eca8f	48ec3e05-6be1-44fd-aa73-c00a45bac6ea	\N	completed	2025-05-20 16:16:18.933572	2025-05-20 16:12:51.234649
9e28d6b7-83a1-4850-95d1-6b112b50b37d	3c05f764-50cc-4d58-b412-a5a5551eca8f	48ec3e05-6be1-44fd-aa73-c00a45bac6ea	\N	completed	2025-05-20 16:16:18.933572	2025-05-20 16:14:42.634529
41d36a2f-0435-4205-9d9c-1316651c54c4	8ca09bd6-0b84-4135-8f62-295cac77a5cc	48ec3e05-6be1-44fd-aa73-c00a45bac6ea	\N	completed	2025-05-20 16:16:35.556515	2025-05-20 16:16:30.066068
\.


--
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: questnest-be_owner
--

COPY public.challenges (id, title, description, category, difficulty, points, type, deadline, creator_id, created_at) FROM stdin;
da7fa585-a994-42f2-9ecb-e798a3090fa3	Leaderboard and Challenge Page	Page untuk leaderboard dan seluruh challenge	Frontend	Medium	80	individu	2024-12-31	\N	2025-05-16 04:31:52.686276
a81e460a-7192-405b-95d0-2a5b2867c278	Backend QuestNest	desc	Backend	Medium	80	individu	2024-12-31	\N	2025-05-16 16:54:40.293954
3fec03e1-87e0-4a33-8411-5bca5ce6ed71	finpro	finpro	Education	Hard	100	\N	\N	\N	2025-05-19 03:16:12.448538
927094d1-80ef-427b-8ce7-32a3988d0f63	Makan Buah dan Sayur selama 1 Minggu	tantangan dalam 7 hari berturut turut makan buah dan sayur agar menjaga kesehatan tubuh	Health	Hard	100	\N	\N	\N	2025-05-20 11:37:49.933743
3c05f764-50cc-4d58-b412-a5a5551eca8f	Berolaraga Rutin 30 menit setiap hari	hidup sehat ya guys	FItness	Easy	100	\N	\N	\N	2025-05-20 16:12:48.032582
2c00f83c-3fda-4118-ba10-6ccaafd07551	Proyek MBD	buatlah proyek menggunakan sensor suara KY-03, implementasinya bebas	Sistem Embedded	Hard	100	\N	\N	\N	2025-05-20 16:13:54.391104
c1b046ef-c6b3-4f5d-80fa-ba3b74e7cb49	Tidur 8 jam setiap hari	jangan bergadang nugas ya teman teman	Health	Hard	100	\N	\N	\N	2025-05-20 16:14:40.498536
8ca09bd6-0b84-4135-8f62-295cac77a5cc	Proyek Dasar Analitik Data	buatlah visualisasi dengna PowerBi dengan dataset di bebaskan	Data Analytics	Hard	100	\N	\N	\N	2025-05-20 16:15:49.505419
\.


--
-- Data for Name: leaderboards; Type: TABLE DATA; Schema: public; Owner: questnest-be_owner
--

COPY public.leaderboards (id, type, reference_id, xp, period) FROM stdin;
\.


--
-- Data for Name: team_challenges; Type: TABLE DATA; Schema: public; Owner: questnest-be_owner
--

COPY public.team_challenges (id, team_id, challenge_id, assigned_at) FROM stdin;
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: questnest-be_owner
--

COPY public.team_members (id, team_id, user_id, role, joined_at) FROM stdin;
7c5a03c9-30ba-4ac6-a962-691bfa0543c2	75b64bf1-f5cd-426f-b2c0-a98bf8f411cf	cfa6ca70-e230-4dc4-9dd2-e1431f5b1eed	member	2025-05-19 04:37:06.325369
6dde0560-04d9-46a4-b482-44dcbc1a3f36	3d9b6966-2615-4a6f-bd57-73c2aa86e400	cfa6ca70-e230-4dc4-9dd2-e1431f5b1eed	member	2025-05-19 07:41:32.661483
b96b8277-dab7-4659-8636-81ebdaafeca6	f94860f7-6ba9-4453-a0f2-3f82338316e7	b40040f2-678e-44a1-9fca-b07caa3cbfeb	member	2025-05-19 10:41:06.624755
f91bc44a-2b6e-4dc9-926c-5f29fa14a0fc	75b64bf1-f5cd-426f-b2c0-a98bf8f411cf	b40040f2-678e-44a1-9fca-b07caa3cbfeb	member	2025-05-20 11:11:32.17215
bf951104-1f71-4554-8f63-d4d8981daa8d	f94860f7-6ba9-4453-a0f2-3f82338316e7	48ec3e05-6be1-44fd-aa73-c00a45bac6ea	member	2025-05-20 11:33:00.352449
75c7267e-aa1c-46e3-9532-04492aebba17	b357e966-fb43-422c-8eac-df7e54517db9	8363c764-064d-4a95-95d9-1a1cc52f5b04	member	2025-05-20 14:30:54.726861
168468cd-124e-494a-a13b-bf49de25a3d0	f94860f7-6ba9-4453-a0f2-3f82338316e7	a5163add-7d79-4b8e-9e20-8016995deebc	member	2025-05-20 15:02:32.326008
63938aff-5b46-4ea9-89d0-a03f0e8e8f03	b357e966-fb43-422c-8eac-df7e54517db9	a5163add-7d79-4b8e-9e20-8016995deebc	member	2025-05-20 15:05:14.918335
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: questnest-be_owner
--

COPY public.teams (id, name, description, creator_id, created_at, xp, xp_weekly, xp_monthly) FROM stdin;
75b64bf1-f5cd-426f-b2c0-a98bf8f411cf	Kelompok 24	kelompok PA SBD	\N	2025-05-16 02:36:30.144551	0	0	0
3d9b6966-2615-4a6f-bd57-73c2aa86e400	tim backend	tim yang bertanggung jawab backend	a5163add-7d79-4b8e-9e20-8016995deebc	2025-05-19 03:53:36.038497	0	0	0
f94860f7-6ba9-4453-a0f2-3f82338316e7	tekomplot team	team gacorr\n	48ec3e05-6be1-44fd-aa73-c00a45bac6ea	2025-05-19 10:37:17.232909	0	0	0
b357e966-fb43-422c-8eac-df7e54517db9	lesun enjoyer	lesuuuuuuunnn	a5163add-7d79-4b8e-9e20-8016995deebc	2025-05-20 07:27:07.993345	0	0	0
2a3400a7-1fa0-4816-8f3d-5a2c51e03a08	pa 24	sbd pa 24	a5163add-7d79-4b8e-9e20-8016995deebc	2025-05-20 10:45:10.862227	0	0	0
087ae287-bcca-4599-a9a2-cb362b1878a7	test	test	a5163add-7d79-4b8e-9e20-8016995deebc	2025-05-20 14:40:28.433652	0	0	0
82e10d33-8ef3-41d1-a8dd-cfbde36af699	testdoang		8363c764-064d-4a95-95d9-1a1cc52f5b04	2025-05-20 14:57:08.854269	0	0	0
\.


--
-- Data for Name: user_badges; Type: TABLE DATA; Schema: public; Owner: questnest-be_owner
--

COPY public.user_badges (id, user_id, badge_id, earned_at, progress) FROM stdin;
04e58482-3e13-4f3f-a66b-cb6384cfc10f	a5163add-7d79-4b8e-9e20-8016995deebc	1f4aab5a-fbc6-47c9-9ccb-985cbd0f78dd	2025-05-20 14:40:28.819004	0
117d8e83-cbd2-4c4a-b25c-5b8972986932	a5163add-7d79-4b8e-9e20-8016995deebc	b7cd2c10-56a1-4154-84bc-41fefcb8a940	2025-05-20 14:40:28.849879	0
afeb0bc7-03e6-4323-9c58-85281bb67a83	8363c764-064d-4a95-95d9-1a1cc52f5b04	b7cd2c10-56a1-4154-84bc-41fefcb8a940	2025-05-20 16:31:52.629621	0
7f1ce688-3eb6-4d2b-acb7-77d738fbe2c1	8363c764-064d-4a95-95d9-1a1cc52f5b04	1f4aab5a-fbc6-47c9-9ccb-985cbd0f78dd	2025-05-20 16:32:26.955978	0
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: questnest-be_owner
--

COPY public.users (id, name, email, password, xp, level, created_at, xp_weekly, xp_monthly, username, avatar) FROM stdin;
8ef6bb76-4486-422f-8ce3-19710ed95048	tes123	tes123@gmail.com	$2b$10$wViQFvP4zSVCHOc5sKG8LeMxSxwnoF/W3ftWXjQKMc4h7f36v2St.	0	1	2025-05-20 16:14:04.956262	0	0	tes.123	\N
47caf1e6-d667-489a-b191-64685da4ec12	alfonsus	alfon@mail.com	$2b$10$6f.pit3kqNv3qFj2DIndMOnAPR0tfpfVAj8dhEnVivVEA9fHOuMxW	0	1	2025-05-16 13:08:08.634596	0	0	\N	\N
48ec3e05-6be1-44fd-aa73-c00a45bac6ea	cecilia	cecilia@mail.com	$2b$10$Gh5ynl/S0t.x9GJNKGt9o.VIQL96sCjB92FlUYi3KrNfhsCks7Eee	1060	1	2025-05-18 10:47:14.402489	1060	1060	odi	\N
cfa6ca70-e230-4dc4-9dd2-e1431f5b1eed	audy natalie	audy@mail.com	$2b$10$jkI9.jUZiux6..odcqVyJu6DKDHi3iqPsThb6XoUSfR20CevldLQW	360	1	2025-05-18 15:13:36.689192	360	360	audy	\N
b40040f2-678e-44a1-9fca-b07caa3cbfeb	aliya	aliya123@mail.com	$2b$10$AHg4mIijBi8SC7BS.Gf4qeo08flIT705Km8w/gDh.DNBgc9gG5Quq	180	1	2025-05-19 10:40:54.556327	180	180	aliyasalamun	\N
a5163add-7d79-4b8e-9e20-8016995deebc	Raditya Alif	dityalif@mail.com	$2b$10$PdBnIwX941Nat1umDGZYperMl9Q8OhYARyerDFg9xyvhdS47EsMuy	260	1	2025-05-18 14:25:45.367822	260	260	dityalif	\N
8363c764-064d-4a95-95d9-1a1cc52f5b04	Samih	samih@mail.com	$2b$10$zDQtcNbOAUOMWyxn6eZ0e.WaWpxQ58PkiTEWseEjnq4NYlhlQnQra	260	1	2025-05-18 21:53:08.222088	260	260	Samih	\N
\.


--
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (id);


--
-- Name: challenge_participants challenge_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.challenge_participants
    ADD CONSTRAINT challenge_participants_pkey PRIMARY KEY (id);


--
-- Name: challenges challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_pkey PRIMARY KEY (id);


--
-- Name: leaderboards leaderboards_pkey; Type: CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.leaderboards
    ADD CONSTRAINT leaderboards_pkey PRIMARY KEY (id);


--
-- Name: team_challenges team_challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.team_challenges
    ADD CONSTRAINT team_challenges_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_team_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_team_id_user_id_key UNIQUE (team_id, user_id);


--
-- Name: teams teams_name_key; Type: CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_name_key UNIQUE (name);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: user_badges user_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_pkey PRIMARY KEY (id);


--
-- Name: user_badges user_badges_user_id_badge_id_unique; Type: CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_badge_id_unique UNIQUE (user_id, badge_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: challenge_participants challenge_participants_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.challenge_participants
    ADD CONSTRAINT challenge_participants_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;


--
-- Name: challenge_participants challenge_participants_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.challenge_participants
    ADD CONSTRAINT challenge_participants_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: challenge_participants challenge_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.challenge_participants
    ADD CONSTRAINT challenge_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: challenges challenges_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: team_challenges team_challenges_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.team_challenges
    ADD CONSTRAINT team_challenges_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;


--
-- Name: team_challenges team_challenges_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.team_challenges
    ADD CONSTRAINT team_challenges_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: team_members team_members_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: team_members team_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: teams teams_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: user_badges user_badges_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE CASCADE;


--
-- Name: user_badges user_badges_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: questnest-be_owner
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

