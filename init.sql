--
-- PostgreSQL database dump
--

\restrict yuFZjDToXztvRcMSgm7wXUIcjpmZda3vE4VZ51Rakei3xaxl3XmPPgrentgGKx5

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-06-17 17:51:24

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
--SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16704)
-- Name: Activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Activities" (
    "Id" uuid NOT NULL,
    "SellerId" uuid NOT NULL,
    "Title" text NOT NULL,
    "BasePrice" numeric NOT NULL,
    "MaxParticipants" integer NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "IsDeleted" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Activities" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16711)
-- Name: ActivitySchedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ActivitySchedules" (
    "Id" uuid NOT NULL,
    "ActivityId" uuid NOT NULL,
    "StartTime" timestamp with time zone NOT NULL,
    "EndTime" timestamp with time zone NOT NULL,
    "TotalSeats" integer NOT NULL,
    "BookedSeats" integer NOT NULL
);


ALTER TABLE public."ActivitySchedules" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16734)
-- Name: OrderItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItems" (
    "Id" uuid NOT NULL,
    "OrderId" uuid NOT NULL,
    "ScheduleId" uuid NOT NULL,
    "PriceAtTimeOfBooking" numeric NOT NULL
);


ALTER TABLE public."OrderItems" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16722)
-- Name: Orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Orders" (
    "Id" uuid NOT NULL,
    "ClientId" uuid NOT NULL,
    "Status" integer NOT NULL,
    "TotalAmount" numeric NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Orders" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16696)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    "Id" uuid NOT NULL,
    "Email" text NOT NULL,
    "PasswordHash" text NOT NULL,
    "FullName" text NOT NULL,
    "Role" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16691)
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;

--
-- TOC entry 4883 (class 0 OID 16704)
-- Dependencies: 219
-- Data for Name: Activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Activities" ("Id", "SellerId", "Title", "BasePrice", "MaxParticipants", "IsActive", "CreatedAt", "IsDeleted") FROM stdin;
512b79a1-52a2-4f8e-80b2-31d75639107e	a1a7190b-9449-4e50-9032-c3f92593b38b	Восхождение на вулкан Горелый	1000	4	t	2026-04-07 11:45:07.174093+07	f
d3ef20ff-7ca4-4d68-ba99-7d7776fd91a8	a1a7190b-9449-4e50-9032-c3f92593b38b	Восхождение на вулкан Авачинский	5000	10	t	2026-04-07 13:32:29.583162+07	f
efe69fc3-76a5-4fd4-8b62-e62b45a549b9	b048a538-fbc9-4d79-9c8e-1dd5e1870131	Джип тур в Малки	2222	23	t	2026-05-18 16:44:28.337062+07	f
a56b1e77-7443-4109-bc07-84284c75e4c6	7a340212-998c-478c-83ca-a7cd2d760ff2	Спуск по реке Камчатка	10000	20	t	2026-04-27 20:13:53.910301+07	f
2f16a1bd-dd1d-4705-8e33-8e6c7981ea48	a1a7190b-9449-4e50-9032-c3f92593b38b	Морская прогулка бухта Русская	15000	15	t	2026-05-19 17:18:37.020328+07	f
3afa2514-65e0-4b76-97df-aeafb451d54d	a1a7190b-9449-4e50-9032-c3f92593b38b	Купание в термальных источниках 'Зеленовские озерки'	2000	15	t	2026-04-07 13:33:35.123875+07	t
efef6a97-49fc-4cf4-8669-651420b602ec	a1a7190b-9449-4e50-9032-c3f92593b38b	Экскурсия по городу Петропавлоск-Камчатский	1000	10	t	2026-05-21 19:22:35.607445+07	t
dc455b08-b948-4283-b5dc-6209640f1c33	a1a7190b-9449-4e50-9032-c3f92593b38b	Прогулка по городу	100	12	t	2026-05-21 19:24:04.310494+07	t
400d3731-5bf0-4e2b-a47e-0e98812eb766	a1a7190b-9449-4e50-9032-c3f92593b38b	Прогулка по бухте	200	12	t	2026-05-21 19:24:56.280509+07	t
b217a189-3066-478f-8d89-eba028508a64	a1a7190b-9449-4e50-9032-c3f92593b38b	тест	1000	100	t	2026-05-21 20:47:14.422697+07	t
\.


--
-- TOC entry 4884 (class 0 OID 16711)
-- Dependencies: 220
-- Data for Name: ActivitySchedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ActivitySchedules" ("Id", "ActivityId", "StartTime", "EndTime", "TotalSeats", "BookedSeats") FROM stdin;
c1504bf2-7c2a-4956-a14b-33783c1a4892	512b79a1-52a2-4f8e-80b2-31d75639107e	2026-04-07 12:19:41.274+07	2026-04-07 12:19:41.274+07	2	0
67ccec3b-c542-45d9-b7d4-8bed474ae04e	a56b1e77-7443-4109-bc07-84284c75e4c6	2026-05-01 05:00:00+07	2026-05-01 16:00:00+07	15	11
e912520c-d56d-4519-bf2d-28cc0bebec9f	d3ef20ff-7ca4-4d68-ba99-7d7776fd91a8	2026-05-28 06:00:00+07	2026-05-28 14:00:00+07	15	0
5521d85e-996c-4088-90d7-f3b557ccdbda	efe69fc3-76a5-4fd4-8b62-e62b45a549b9	2026-05-31 07:00:00+07	2026-05-31 18:00:00+07	10	1
d9ee7457-3d8f-4f4f-a37c-ec6a7558c588	512b79a1-52a2-4f8e-80b2-31d75639107e	2026-05-10 17:00:00+07	2026-05-10 21:00:00+07	4	3
350794d7-4f51-4d99-8938-b1f6110cd96d	3afa2514-65e0-4b76-97df-aeafb451d54d	2026-05-16 01:00:00+07	2026-05-16 04:00:00+07	15	4
67c50c6f-6f86-4910-8f16-269bd479c3db	efef6a97-49fc-4cf4-8669-651420b602ec	2026-05-29 10:00:00+07	2026-05-29 16:00:00+07	11	0
66d1b485-1c47-4955-8fb6-0c42523fd173	400d3731-5bf0-4e2b-a47e-0e98812eb766	2026-05-29 11:00:00+07	2026-05-29 15:00:00+07	10	0
3cba00e6-ac2a-4b65-a6f8-239a96b12425	dc455b08-b948-4283-b5dc-6209640f1c33	2026-05-29 10:00:00+07	2026-05-29 14:00:00+07	8	1
f0649df8-5e8f-4a1a-8dbd-c0828d2d048f	b217a189-3066-478f-8d89-eba028508a64	2026-05-28 05:00:00+07	2026-05-28 22:00:00+07	10	0
e7de546d-f707-49b8-8cd6-3ac1849e1ec2	d3ef20ff-7ca4-4d68-ba99-7d7776fd91a8	2026-05-15 15:00:00+07	2026-05-15 23:00:00+07	10	10
\.


--
-- TOC entry 4886 (class 0 OID 16734)
-- Dependencies: 222
-- Data for Name: OrderItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItems" ("Id", "OrderId", "ScheduleId", "PriceAtTimeOfBooking") FROM stdin;
28778a06-512d-4db5-84f0-732fa90d9cb5	cc852955-4966-4940-974d-2d9d4b1b3eab	350794d7-4f51-4d99-8938-b1f6110cd96d	2000
c206b3fb-b6f8-4082-a07b-1b9d7e159f75	cc852955-4966-4940-974d-2d9d4b1b3eab	e7de546d-f707-49b8-8cd6-3ac1849e1ec2	5000
c52a8452-dc4b-4cd3-abf7-e191d1c325bd	cc852955-4966-4940-974d-2d9d4b1b3eab	d9ee7457-3d8f-4f4f-a37c-ec6a7558c588	1000
8f977305-0c35-475e-9d47-a2abbb6b372e	21c52381-f7d4-4632-a26e-20bee21feec8	67ccec3b-c542-45d9-b7d4-8bed474ae04e	10000
8c92ba98-f2b8-4620-966a-a902d4d9d042	9353ff0d-88cf-4805-9a69-d4a596ec88ad	67ccec3b-c542-45d9-b7d4-8bed474ae04e	10000
913772e4-05eb-47f3-b3df-82db80894263	0d1f87c2-0bf9-4d4b-978a-d7e9fb0597cb	67ccec3b-c542-45d9-b7d4-8bed474ae04e	10000
51627a7d-3f96-479b-8958-d4bb5bf8b32f	bbc2b90c-bc73-4db2-877d-2ae590e7384a	67ccec3b-c542-45d9-b7d4-8bed474ae04e	10000
dffa6f86-b11e-40a4-be9a-e09e73432768	b4741686-f812-419f-a54a-517828caff92	67ccec3b-c542-45d9-b7d4-8bed474ae04e	10000
1e6b81c7-5db6-4b06-925b-ac51532166e2	83ee7355-3f7e-467b-b7d7-5e3f57456bba	67ccec3b-c542-45d9-b7d4-8bed474ae04e	10000
f811a22f-ca7a-4eaf-b3ce-40f5b177fe3f	3583eeef-9411-4500-8321-3efebde21c09	67ccec3b-c542-45d9-b7d4-8bed474ae04e	10000
3979e6e6-6d31-4d17-bd30-cd896967324a	a45d984f-e16e-41b3-9902-b00aafb7b26a	67ccec3b-c542-45d9-b7d4-8bed474ae04e	10000
000d9335-0c75-49e2-ac93-1b0e3bd8fc97	413cc4bb-0702-4954-988e-018168e7f4b4	67ccec3b-c542-45d9-b7d4-8bed474ae04e	10000
2432efa7-e658-4696-8fb0-c6b09a50302c	9381edcf-3c13-4e60-8f67-6a61726f75cb	67ccec3b-c542-45d9-b7d4-8bed474ae04e	10000
01ff1266-5907-47b4-9a4e-d4f702833047	8091ca6e-a859-405a-a6a3-bb77fa456820	67ccec3b-c542-45d9-b7d4-8bed474ae04e	10000
20a0c4ba-506a-412f-93c8-6cabbe7c40c5	a6ebc5e7-a669-4ce4-9c04-1494ac53f9cc	5521d85e-996c-4088-90d7-f3b557ccdbda	2222
e7f2995a-122a-4f16-b762-3e5723b40e40	a8c559f2-4eac-4914-b6e7-ce14a899bed8	d9ee7457-3d8f-4f4f-a37c-ec6a7558c588	1000
b5c3ee03-c072-45ed-a11b-22a82a9c52bd	1704f256-2233-41a6-b29f-51a261abe85f	d9ee7457-3d8f-4f4f-a37c-ec6a7558c588	1000
86a0812b-a37c-443b-aa35-0248ef84c639	0198bd39-2d1c-4e43-bcb6-638383ead9e7	350794d7-4f51-4d99-8938-b1f6110cd96d	2000
2466d6bf-029d-47fb-ac27-5268150af128	121c698e-a33a-43ae-908a-58fc46377a4f	3cba00e6-ac2a-4b65-a6f8-239a96b12425	100
897b7bff-7dcf-4ea5-87b5-0f023cc7ef5b	ef4582ec-5a43-4b01-a265-6a19dabf239e	e7de546d-f707-49b8-8cd6-3ac1849e1ec2	5000
21fb8856-aa35-4455-abed-bbaa5c2cc4f8	20549dc2-5b1f-40de-96c7-3c7688698c01	e7de546d-f707-49b8-8cd6-3ac1849e1ec2	5000
a2381c24-30aa-4268-9d01-6e6b0bf0f0c3	24206f29-c516-41e4-ac03-35c35ade6ea6	e7de546d-f707-49b8-8cd6-3ac1849e1ec2	5000
85047219-890e-4c66-8aca-04e8ff46ab0b	2fc9cae5-906e-45b8-96cc-e91648d48437	e7de546d-f707-49b8-8cd6-3ac1849e1ec2	5000
da3ef520-46ec-4ae8-9c92-13c444691cf8	09f524b6-88e8-4fdb-bac9-e112d03dc85d	e7de546d-f707-49b8-8cd6-3ac1849e1ec2	5000
069829a0-4c52-4c0b-87a9-62d8e98818e4	1a8031ea-aef5-4d4b-a86d-b5af67c4f54c	e7de546d-f707-49b8-8cd6-3ac1849e1ec2	5000
d0b473c8-85fa-411c-98cd-e101729ede56	497eff0f-71e5-4f62-a44f-f4050917770c	e7de546d-f707-49b8-8cd6-3ac1849e1ec2	5000
\.


--
-- TOC entry 4885 (class 0 OID 16722)
-- Dependencies: 221
-- Data for Name: Orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Orders" ("Id", "ClientId", "Status", "TotalAmount", "CreatedAt") FROM stdin;
21c52381-f7d4-4632-a26e-20bee21feec8	896bd66a-64b9-4dbe-94c2-029fd50926f2	0	10000	2026-04-27 20:24:13.587349+07
9353ff0d-88cf-4805-9a69-d4a596ec88ad	896bd66a-64b9-4dbe-94c2-029fd50926f2	0	10000	2026-04-27 20:24:33.058937+07
0d1f87c2-0bf9-4d4b-978a-d7e9fb0597cb	896bd66a-64b9-4dbe-94c2-029fd50926f2	0	10000	2026-04-27 20:32:27.035666+07
bbc2b90c-bc73-4db2-877d-2ae590e7384a	896bd66a-64b9-4dbe-94c2-029fd50926f2	0	10000	2026-04-27 20:32:49.778515+07
b4741686-f812-419f-a54a-517828caff92	896bd66a-64b9-4dbe-94c2-029fd50926f2	0	10000	2026-04-27 20:42:27.5831+07
83ee7355-3f7e-467b-b7d7-5e3f57456bba	896bd66a-64b9-4dbe-94c2-029fd50926f2	0	10000	2026-04-27 20:42:50.377245+07
3583eeef-9411-4500-8321-3efebde21c09	896bd66a-64b9-4dbe-94c2-029fd50926f2	0	10000	2026-04-27 20:44:21.694437+07
a45d984f-e16e-41b3-9902-b00aafb7b26a	896bd66a-64b9-4dbe-94c2-029fd50926f2	0	10000	2026-04-27 20:44:27.220284+07
413cc4bb-0702-4954-988e-018168e7f4b4	896bd66a-64b9-4dbe-94c2-029fd50926f2	0	10000	2026-04-27 20:45:13.556584+07
9381edcf-3c13-4e60-8f67-6a61726f75cb	896bd66a-64b9-4dbe-94c2-029fd50926f2	0	10000	2026-04-27 20:50:49.06027+07
8091ca6e-a859-405a-a6a3-bb77fa456820	896bd66a-64b9-4dbe-94c2-029fd50926f2	0	10000	2026-04-27 20:55:28.436369+07
cc852955-4966-4940-974d-2d9d4b1b3eab	ef8de995-4328-44e3-b21b-5cfa1e5b6fa9	1	8000	2026-04-07 13:39:35.334809+07
a6ebc5e7-a669-4ce4-9c04-1494ac53f9cc	a93d563e-c627-4741-b29f-ad50666158d6	1	2222	2026-05-18 16:49:32.271625+07
a8c559f2-4eac-4914-b6e7-ce14a899bed8	a93d563e-c627-4741-b29f-ad50666158d6	3	1000	2026-05-18 16:49:32.344127+07
1704f256-2233-41a6-b29f-51a261abe85f	ee4a6b83-0a7e-4c41-b2d5-e1dc1b9f2601	1	1000	2026-05-18 17:14:43.326415+07
0198bd39-2d1c-4e43-bcb6-638383ead9e7	ee4a6b83-0a7e-4c41-b2d5-e1dc1b9f2601	0	2000	2026-05-19 19:59:42.713703+07
121c698e-a33a-43ae-908a-58fc46377a4f	ee4a6b83-0a7e-4c41-b2d5-e1dc1b9f2601	1	100	2026-05-21 19:26:02.22116+07
ef4582ec-5a43-4b01-a265-6a19dabf239e	ee4a6b83-0a7e-4c41-b2d5-e1dc1b9f2601	2	5000	2026-05-21 20:46:07.444877+07
20549dc2-5b1f-40de-96c7-3c7688698c01	ee4a6b83-0a7e-4c41-b2d5-e1dc1b9f2601	0	5000	2026-06-13 03:15:53.527565+07
24206f29-c516-41e4-ac03-35c35ade6ea6	ee4a6b83-0a7e-4c41-b2d5-e1dc1b9f2601	0	5000	2026-06-13 03:17:07.005921+07
2fc9cae5-906e-45b8-96cc-e91648d48437	ee4a6b83-0a7e-4c41-b2d5-e1dc1b9f2601	0	5000	2026-06-13 03:17:15.3053+07
09f524b6-88e8-4fdb-bac9-e112d03dc85d	ee4a6b83-0a7e-4c41-b2d5-e1dc1b9f2601	0	5000	2026-06-13 03:17:22.977743+07
1a8031ea-aef5-4d4b-a86d-b5af67c4f54c	ee4a6b83-0a7e-4c41-b2d5-e1dc1b9f2601	0	5000	2026-06-13 03:17:30.858216+07
497eff0f-71e5-4f62-a44f-f4050917770c	ee4a6b83-0a7e-4c41-b2d5-e1dc1b9f2601	0	5000	2026-06-13 03:17:39.390973+07
\.


--
-- TOC entry 4882 (class 0 OID 16696)
-- Dependencies: 218
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" ("Id", "Email", "PasswordHash", "FullName", "Role", "CreatedAt") FROM stdin;
a1a7190b-9449-4e50-9032-c3f92593b38b	test-guide@mail.com	$2a$11$SEN.POByK3spQ6sCoNx5E.u0reipKSkfHIkHKtw7U81vQeJMBYzgm	Иван Иванов	1	2026-04-07 10:32:48.718156+07
2f3f0b52-5c13-466a-b265-475975fda097	seller@gmail.com	$2a$11$a8fx7HgaXnq8HE8Hk1I//eL4S.PZ.s4VRZLubY.V9mmhjutml5Z.i	Корней Иванович Петров	2	2026-04-07 11:34:26.515665+07
ef8de995-4328-44e3-b21b-5cfa1e5b6fa9	client@gmail.com	$2a$11$djsQxJi9WtQDwdlkW4MjG.aYWh8QQDsdiKFvdVRswuTjg6hVWf3Bm	Сергей Сергеев	0	2026-04-07 12:47:47.383895+07
02ee77a0-6452-4b12-a40f-9e548d94e9d0	test123@gmail.com	$2a$11$FOVgbgZ9FDhrE9gz8TR2G.lzr.j9X/zVw6csYNCL4.SR45lc63/xS	Сергей Александров	0	2026-04-07 18:35:01.334497+07
7a340212-998c-478c-83ca-a7cd2d760ff2	petr@gmail.com	$2a$11$wzLZB59EXNBEm10coUWgReFZjI7q4U6/iIE/iGvv7nbgVm2kLfvyu	Алексеев Петр Иванович	1	2026-04-27 20:13:21.166862+07
896bd66a-64b9-4dbe-94c2-029fd50926f2	alex@gmail.com	$2a$11$PkFBwj6ioRTVsYG7z2yMReVv0qAeA9lCyuXi8zfNJDM1iVId8vIge	Иванов Александр Николаевич	0	2026-04-27 20:23:46.684895+07
b048a538-fbc9-4d79-9c8e-1dd5e1870131	gid3@gmail.com	$2a$11$5UkViCTjCzUyKxN9QceTfuo0qBXH.h7Dt6s6Z7vSXFRWHW5J.osKC	Иван Андреевич Гусев	1	2026-05-18 16:43:39.239775+07
a93d563e-c627-4741-b29f-ad50666158d6	client23@gmail.com	$2a$11$ufqcEIBD/ErXcZ.e5QqMCezaYvdV2LcsHcEZs6nWxazP0XZQhbVvm	Вадим Иванович Петров	0	2026-05-18 16:47:40.166003+07
ee4a6b83-0a7e-4c41-b2d5-e1dc1b9f2601	suhorukovjtx2003@gmail.com	$2a$11$5Op1NhSB6wvuBYMpQc4NpO2w676A1OHE9.YZCv0je4XsaFOBpwHqy	K D S	0	2026-05-18 17:14:08.690206+07
9c741b75-efe1-4677-9adc-7773f25624fa	admin@gmail.com	$2a$11$a82rxwOJMCv7hjivK3oX6.grIOClaPDaMEUp/Gqt4CqVVhMMGsMF6	Админ Админович Админов	2	2026-05-19 10:10:40.568887+07
25377d24-480d-4a1c-bdad-5b01d2cd9f58	adminmain@gmail.com	$2a$11$9fi5nOLswJWYhcDbTTyVOO7cPVRSS4nxa6XLVvq5bfhGCGt9GkA9.	Алексеев Петр Иванович	2	2026-06-13 23:27:43.177307+07
\.


--
-- TOC entry 4881 (class 0 OID 16691)
-- Dependencies: 217
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
20260407024303_InitialCreate	9.0.14
20260407034645_AddActivitiesTable	9.0.14
20260407051357_AddActivitySchedules	9.0.14
20260407062557_AddOrders	9.0.14
20260521101822_AddSoftDeleteToActivities	9.0.14
\.


--
-- TOC entry 4721 (class 2606 OID 16710)
-- Name: Activities PK_Activities; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activities"
    ADD CONSTRAINT "PK_Activities" PRIMARY KEY ("Id");


--
-- TOC entry 4724 (class 2606 OID 16715)
-- Name: ActivitySchedules PK_ActivitySchedules; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivitySchedules"
    ADD CONSTRAINT "PK_ActivitySchedules" PRIMARY KEY ("Id");


--
-- TOC entry 4731 (class 2606 OID 16740)
-- Name: OrderItems PK_OrderItems; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "PK_OrderItems" PRIMARY KEY ("Id");


--
-- TOC entry 4727 (class 2606 OID 16728)
-- Name: Orders PK_Orders; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "PK_Orders" PRIMARY KEY ("Id");


--
-- TOC entry 4719 (class 2606 OID 16702)
-- Name: Users PK_Users; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "PK_Users" PRIMARY KEY ("Id");


--
-- TOC entry 4716 (class 2606 OID 16695)
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- TOC entry 4722 (class 1259 OID 16721)
-- Name: IX_ActivitySchedules_ActivityId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ActivitySchedules_ActivityId" ON public."ActivitySchedules" USING btree ("ActivityId");


--
-- TOC entry 4728 (class 1259 OID 16751)
-- Name: IX_OrderItems_OrderId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_OrderItems_OrderId" ON public."OrderItems" USING btree ("OrderId");


--
-- TOC entry 4729 (class 1259 OID 16752)
-- Name: IX_OrderItems_ScheduleId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_OrderItems_ScheduleId" ON public."OrderItems" USING btree ("ScheduleId");


--
-- TOC entry 4725 (class 1259 OID 16753)
-- Name: IX_Orders_ClientId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Orders_ClientId" ON public."Orders" USING btree ("ClientId");


--
-- TOC entry 4717 (class 1259 OID 16703)
-- Name: IX_Users_Email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_Users_Email" ON public."Users" USING btree ("Email");


--
-- TOC entry 4732 (class 2606 OID 16716)
-- Name: ActivitySchedules FK_ActivitySchedules_Activities_ActivityId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivitySchedules"
    ADD CONSTRAINT "FK_ActivitySchedules_Activities_ActivityId" FOREIGN KEY ("ActivityId") REFERENCES public."Activities"("Id") ON DELETE CASCADE;


--
-- TOC entry 4734 (class 2606 OID 16741)
-- Name: OrderItems FK_OrderItems_ActivitySchedules_ScheduleId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "FK_OrderItems_ActivitySchedules_ScheduleId" FOREIGN KEY ("ScheduleId") REFERENCES public."ActivitySchedules"("Id") ON DELETE RESTRICT;


--
-- TOC entry 4735 (class 2606 OID 16746)
-- Name: OrderItems FK_OrderItems_Orders_OrderId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "FK_OrderItems_Orders_OrderId" FOREIGN KEY ("OrderId") REFERENCES public."Orders"("Id") ON DELETE CASCADE;


--
-- TOC entry 4733 (class 2606 OID 16729)
-- Name: Orders FK_Orders_Users_ClientId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "FK_Orders_Users_ClientId" FOREIGN KEY ("ClientId") REFERENCES public."Users"("Id") ON DELETE CASCADE;


-- Completed on 2026-06-17 17:51:24

--
-- PostgreSQL database dump complete
--

\unrestrict yuFZjDToXztvRcMSgm7wXUIcjpmZda3vE4VZ51Rakei3xaxl3XmPPgrentgGKx5

