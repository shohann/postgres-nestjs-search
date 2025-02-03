--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: array_to_text_immutable(text[]); Type: FUNCTION; Schema: public; Owner: chat_db_user
--

CREATE FUNCTION public.array_to_text_immutable(text[]) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $_$
  SELECT COALESCE(
    (SELECT string_agg(elem, ' ')
     FROM unnest($1) AS elem),
    ''
  );
$_$;


ALTER FUNCTION public.array_to_text_immutable(text[]) OWNER TO chat_db_user;

--
-- Name: immutable_array_to_string(anyarray, text); Type: FUNCTION; Schema: public; Owner: chat_db_user
--

CREATE FUNCTION public.immutable_array_to_string(anyarray, text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $_$
  SELECT array_to_string($1, $2);
$_$;


ALTER FUNCTION public.immutable_array_to_string(anyarray, text) OWNER TO chat_db_user;

--
-- Name: immutable_concat(text[]); Type: FUNCTION; Schema: public; Owner: chat_db_user
--

CREATE FUNCTION public.immutable_concat(VARIADIC text[]) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $_$
  SELECT concat($1[1:array_length($1,1)]);
$_$;


ALTER FUNCTION public.immutable_concat(VARIADIC text[]) OWNER TO chat_db_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: professionals; Type: TABLE; Schema: public; Owner: chat_db_user
--

CREATE TABLE public.professionals (
    id integer NOT NULL,
    type text DEFAULT 'Organization'::text NOT NULL,
    org_prac_id text NOT NULL,
    username_url text NOT NULL,
    name text NOT NULL,
    ranking integer NOT NULL,
    photo text,
    category text NOT NULL,
    sub_categories text[],
    rating double precision NOT NULL,
    total_appointment integer NOT NULL,
    zones text[],
    branches text[],
    area_of_practice text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.professionals OWNER TO chat_db_user;

--
-- Name: professionals_id_seq; Type: SEQUENCE; Schema: public; Owner: chat_db_user
--

CREATE SEQUENCE public.professionals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.professionals_id_seq OWNER TO chat_db_user;

--
-- Name: professionals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chat_db_user
--

ALTER SEQUENCE public.professionals_id_seq OWNED BY public.professionals.id;


--
-- Name: professionals id; Type: DEFAULT; Schema: public; Owner: chat_db_user
--

ALTER TABLE ONLY public.professionals ALTER COLUMN id SET DEFAULT nextval('public.professionals_id_seq'::regclass);


--
-- Data for Name: professionals; Type: TABLE DATA; Schema: public; Owner: chat_db_user
--

COPY public.professionals (id, type, org_prac_id, username_url, name, ranking, photo, category, sub_categories, rating, total_appointment, zones, branches, area_of_practice, created_at, updated_at) FROM stdin;
1	Organization	1234567	hospital1_url	Hospital 1	10	https://example.com/hospital1.jpg	Doctor	{Medicine,Eye}	4.7	1000	{Cal,Nev,NY,Dhaka}	{"branch 1","Branch 2",Uttara}	local	2025-01-31 13:03:11.386	2025-01-31 13:16:56.905
2	Organization	7654321	hospital2_url	Hospital 2	8	https://example.com/hospital2.jpg	Nurse	{Dentistry,Pediatrics}	4.9	850	{Cal,Tex}	{"Main Branch","Downtown Branch"}	regional	2025-01-31 13:03:11.393	2025-02-03 06:49:32.01
3	Organization	9876543	clinic1_url	Specialty Clinic 1	9	https://example.com/clinic1.jpg	Doctor	{Cardiology,"Internal Medicine"}	4.8	1200	{NY,NJ}	{Manhattan,Brooklyn}	local	2025-01-31 13:03:11.398	2025-02-03 07:21:29.082
\.


--
-- Name: professionals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chat_db_user
--

SELECT pg_catalog.setval('public.professionals_id_seq', 3, true);


--
-- Name: professionals professionals_pkey; Type: CONSTRAINT; Schema: public; Owner: chat_db_user
--

ALTER TABLE ONLY public.professionals
    ADD CONSTRAINT professionals_pkey PRIMARY KEY (id);


--
-- Name: professionals_org_prac_id_key; Type: INDEX; Schema: public; Owner: chat_db_user
--

CREATE UNIQUE INDEX professionals_org_prac_id_key ON public.professionals USING btree (org_prac_id);


--
-- Name: professionals_search_text_fts_idx; Type: INDEX; Schema: public; Owner: chat_db_user
--

CREATE INDEX professionals_search_text_fts_idx ON public.professionals USING gin (to_tsvector('english'::regconfig, public.immutable_concat(VARIADIC ARRAY[category, ' '::text, public.immutable_array_to_string(zones, ' '::text), ' '::text, public.immutable_array_to_string(branches, ' '::text)])));


--
-- Name: professionals_search_text_trgm_idx; Type: INDEX; Schema: public; Owner: chat_db_user
--

CREATE INDEX professionals_search_text_trgm_idx ON public.professionals USING gin ((((((category || ' '::text) || public.array_to_text_immutable(zones)) || ' '::text) || public.array_to_text_immutable(branches))) public.gin_trgm_ops);


--
-- Name: professionals_username_url_key; Type: INDEX; Schema: public; Owner: chat_db_user
--

CREATE UNIQUE INDEX professionals_username_url_key ON public.professionals USING btree (username_url);


--
-- PostgreSQL database dump complete
--

