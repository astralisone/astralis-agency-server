--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

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
-- Name: ItemStatus; Type: TYPE; Schema: public; Owner: gregstarr
--

CREATE TYPE public."ItemStatus" AS ENUM (
    'AVAILABLE',
    'SOLD_OUT',
    'COMING_SOON'
);


ALTER TYPE public."ItemStatus" OWNER TO gregstarr;

--
-- Name: PostStatus; Type: TYPE; Schema: public; Owner: gregstarr
--

CREATE TYPE public."PostStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


ALTER TYPE public."PostStatus" OWNER TO gregstarr;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: gregstarr
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'AUTHOR',
    'EDITOR',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO gregstarr;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _MarketplaceItemToTag; Type: TABLE; Schema: public; Owner: gregstarr
--

CREATE TABLE public."_MarketplaceItemToTag" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_MarketplaceItemToTag" OWNER TO gregstarr;

--
-- Name: _PostToTag; Type: TABLE; Schema: public; Owner: gregstarr
--

CREATE TABLE public."_PostToTag" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_PostToTag" OWNER TO gregstarr;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: gregstarr
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO gregstarr;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: gregstarr
--

CREATE TABLE public.categories (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO gregstarr;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: gregstarr
--

CREATE TABLE public.comments (
    id text NOT NULL,
    content text NOT NULL,
    "postId" text NOT NULL,
    "authorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.comments OWNER TO gregstarr;

--
-- Name: contact_forms; Type: TABLE; Schema: public; Owner: gregstarr
--

CREATE TABLE public.contact_forms (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.contact_forms OWNER TO gregstarr;

--
-- Name: likes; Type: TABLE; Schema: public; Owner: gregstarr
--

CREATE TABLE public.likes (
    id text NOT NULL,
    "postId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.likes OWNER TO gregstarr;

--
-- Name: marketplace_items; Type: TABLE; Schema: public; Owner: gregstarr
--

CREATE TABLE public.marketplace_items (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL,
    "imageUrl" text NOT NULL,
    status public."ItemStatus" DEFAULT 'AVAILABLE'::public."ItemStatus" NOT NULL,
    "categoryId" text NOT NULL,
    "sellerId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    specifications jsonb,
    features text[],
    stock integer DEFAULT 0 NOT NULL,
    "discountPrice" numeric(10,2),
    weight numeric(10,2),
    dimensions jsonb,
    featured boolean DEFAULT false NOT NULL,
    published boolean DEFAULT true NOT NULL,
    "sortOrder" integer
);


ALTER TABLE public.marketplace_items OWNER TO gregstarr;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: gregstarr
--

CREATE TABLE public.posts (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    excerpt text,
    "featuredImage" text,
    status public."PostStatus" DEFAULT 'DRAFT'::public."PostStatus" NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "authorId" text NOT NULL,
    "categoryId" text NOT NULL,
    "metaTitle" text,
    "metaDescription" text,
    keywords text[],
    "viewCount" integer DEFAULT 0 NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    pinned boolean DEFAULT false NOT NULL,
    "sortOrder" integer,
    locale text DEFAULT 'en'::text NOT NULL
);


ALTER TABLE public.posts OWNER TO gregstarr;

--
-- Name: tags; Type: TABLE; Schema: public; Owner: gregstarr
--

CREATE TABLE public.tags (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.tags OWNER TO gregstarr;

--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: gregstarr
--

CREATE TABLE public.testimonials (
    id text NOT NULL,
    content text NOT NULL,
    rating integer DEFAULT 5 NOT NULL,
    "authorId" text NOT NULL,
    role text,
    company text,
    avatar text,
    featured boolean DEFAULT false NOT NULL,
    published boolean DEFAULT true NOT NULL,
    "sortOrder" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.testimonials OWNER TO gregstarr;

--
-- Name: users; Type: TABLE; Schema: public; Owner: gregstarr
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    password text NOT NULL,
    avatar text,
    bio text,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO gregstarr;

--
-- Name: wishlists; Type: TABLE; Schema: public; Owner: gregstarr
--

CREATE TABLE public.wishlists (
    id text NOT NULL,
    "userId" text NOT NULL,
    "itemId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.wishlists OWNER TO gregstarr;

--
-- Data for Name: _MarketplaceItemToTag; Type: TABLE DATA; Schema: public; Owner: gregstarr
--

COPY public."_MarketplaceItemToTag" ("A", "B") FROM stdin;
06e9c2c0-1020-4227-babd-237612b3c5f5	42fd065a-a7c9-4b55-8170-f2d7def049c4
d014e9f9-3f6b-44e5-b0ad-ebf9ece1d634	8e9d42ae-7241-4da3-a499-b2dae7eacd9e
d014e9f9-3f6b-44e5-b0ad-ebf9ece1d634	6941676a-1641-4464-bf7b-b990e1c42dd2
a321d3ef-af59-40f1-81e0-c787bd9a737a	8e9d42ae-7241-4da3-a499-b2dae7eacd9e
a321d3ef-af59-40f1-81e0-c787bd9a737a	2e28782b-cc08-4b25-9041-6b19c6d8456d
8b8f8810-4a2f-4647-b0ec-24742ae7f264	499f65b6-be1f-42f1-b7fa-fc879655ede4
82fcf3ef-0682-44f5-a5d4-a3550fd5a433	499f65b6-be1f-42f1-b7fa-fc879655ede4
82fcf3ef-0682-44f5-a5d4-a3550fd5a433	28756872-eecd-4abf-9fa6-fd50c5e0e652
7c82af40-a33b-4d5c-94e9-73d7a253e083	9aa9153c-87d3-4078-9d0d-81bcd1e766a4
7c82af40-a33b-4d5c-94e9-73d7a253e083	bac42379-2e13-4b54-9db8-9e9f1ddff251
7c82af40-a33b-4d5c-94e9-73d7a253e083	131c8ef4-4f49-43ec-9624-91451ff24334
6ef109c8-be81-4d2e-9fb2-bcb3e135da65	57f890f7-e4e2-430d-adbc-fedab4eaf1de
6ef109c8-be81-4d2e-9fb2-bcb3e135da65	c6bc17e9-7455-455e-a761-36056aa054b2
90376bed-a259-4df1-9f19-b8bb0af79dd7	8e9d42ae-7241-4da3-a499-b2dae7eacd9e
90376bed-a259-4df1-9f19-b8bb0af79dd7	b367accf-f8cf-48a4-a715-144e0a7a9f6d
90376bed-a259-4df1-9f19-b8bb0af79dd7	6941676a-1641-4464-bf7b-b990e1c42dd2
f52c687e-2d0f-419d-b6f8-a68a0e249cce	2e28782b-cc08-4b25-9041-6b19c6d8456d
f52c687e-2d0f-419d-b6f8-a68a0e249cce	a6807f76-1f2c-452b-be0c-8567dc07ca3e
d2f8300e-7074-46bd-b1e1-9700ba6a4fe8	42fd065a-a7c9-4b55-8170-f2d7def049c4
d2f8300e-7074-46bd-b1e1-9700ba6a4fe8	9aa9153c-87d3-4078-9d0d-81bcd1e766a4
d2f8300e-7074-46bd-b1e1-9700ba6a4fe8	131c8ef4-4f49-43ec-9624-91451ff24334
d5691787-fd9d-49ae-97a1-2edcd70c95a0	c6bc17e9-7455-455e-a761-36056aa054b2
d5691787-fd9d-49ae-97a1-2edcd70c95a0	820c59a6-dc3b-4600-a0f9-f2f3c4814f7c
d5691787-fd9d-49ae-97a1-2edcd70c95a0	131c8ef4-4f49-43ec-9624-91451ff24334
bd6655a1-756b-4ab8-b5ed-93930bbd4ca0	c6bc17e9-7455-455e-a761-36056aa054b2
bd6655a1-756b-4ab8-b5ed-93930bbd4ca0	131c8ef4-4f49-43ec-9624-91451ff24334
02890b43-de1f-4f94-ae1b-d950e2f989da	499f65b6-be1f-42f1-b7fa-fc879655ede4
02890b43-de1f-4f94-ae1b-d950e2f989da	28756872-eecd-4abf-9fa6-fd50c5e0e652
2f2dbfa5-cd19-4e9f-b567-cccd92f12d23	42fd065a-a7c9-4b55-8170-f2d7def049c4
2f2dbfa5-cd19-4e9f-b567-cccd92f12d23	bac42379-2e13-4b54-9db8-9e9f1ddff251
2f2dbfa5-cd19-4e9f-b567-cccd92f12d23	1e2812a3-3efc-40c1-afb3-99931af73c23
\.


--
-- Data for Name: _PostToTag; Type: TABLE DATA; Schema: public; Owner: gregstarr
--

COPY public."_PostToTag" ("A", "B") FROM stdin;
51dda985-3635-49d5-b606-b724bc5f4020	8e9d42ae-7241-4da3-a499-b2dae7eacd9e
b4d57e9f-21cf-429e-a21a-1810ad8e5d3e	42fd065a-a7c9-4b55-8170-f2d7def049c4
fe64fe38-cbf0-49f5-9a63-13a0cdb51cad	2e28782b-cc08-4b25-9041-6b19c6d8456d
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: gregstarr
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a1424ac6-11f9-4d84-94a8-046c939dc652	c8c361ad319a9f05e63c20904a3f7ec4642f7bcd31765674132b4d178ebb9999	2025-02-24 06:53:33.483536-06	20250224125333_init	\N	\N	2025-02-24 06:53:33.415523-06	1
8b110bf3-afbf-4598-8ea8-8e66bf7b8aae	148643356eb09a9e110e3baf5812ce2c72a2d0f555dae40617debe135bea620d	2025-02-26 03:35:30.612502-06	20250226093530_add_testimonials	\N	\N	2025-02-26 03:35:30.600308-06	1
f28f48c1-0bb2-4bab-a0d1-f8af5e8e5c3f	13b4ad2eaf0544b18e3b0058b690c692e096d7a89cac3498be3baaf3d1bb7eaf	2025-06-12 12:45:51.771308-05	20250612174551_add_contact_form	\N	\N	2025-06-12 12:45:51.691062-05	1
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: gregstarr
--

COPY public.categories (id, name, slug, description, "createdAt", "updatedAt") FROM stdin;
53b1abff-e9c8-4c21-9c75-0d820bbe617a	Web Development	web-development	Web development services and solutions	2025-02-24 12:55:00.532	2025-02-24 12:55:00.532
4c0ce9e4-f874-455b-b7b1-82bae38cffdd	Design	design	Design services including UI/UX and branding	2025-02-24 12:55:00.532	2025-02-24 12:55:00.532
a1050860-3ab4-4a26-be87-a5768f987d53	Digital Marketing	digital-marketing	Digital marketing and SEO services	2025-02-24 12:55:00.532	2025-02-24 12:55:00.532
f3de3256-eddb-49a8-80c5-90843d302e8f	Mobile Development	mobile-development	Mobile app development for iOS and Android	2025-02-26 06:49:13.977	2025-02-26 06:49:13.977
ae146607-0b40-4e1e-aeb7-c7458a554735	UI/UX Design	ui-ux-design	User interface and experience design services	2025-02-26 06:49:13.982	2025-02-26 06:49:13.982
c2d8547e-77e6-4d9a-b598-22f20837c585	E-commerce	e-commerce	Online store development and solutions	2025-02-26 06:49:14.041	2025-02-26 06:49:14.041
3e8b1386-445c-4d35-a4ef-f87e9504afcf	Content Marketing	content-marketing	Content creation and marketing strategies	2025-02-26 06:49:14.048	2025-02-26 06:49:14.048
5cd56f3f-5052-4d34-9928-69bf231d10da	Social Media	social-media	Social media management and marketing	2025-02-26 06:49:14.051	2025-02-26 06:49:14.051
4b762743-ddcb-470a-92a2-a78b6601bad0	Graphic Design	graphic-design	Visual design services for print and digital media	2025-02-26 06:49:14.054	2025-02-26 06:49:14.054
99d00403-2325-4a70-be94-2d56ad03741d	Branding	branding	Brand identity and strategy services	2025-02-26 06:49:14.057	2025-02-26 06:49:14.057
a5e0f30e-f129-4abb-a558-a7f0036796e4	Business Strategy	business-strategy	Business consulting and strategy services	2025-02-26 06:49:14.059	2025-02-26 06:49:14.059
97a416f5-2495-4b34-86c7-b4314494cde3	Startup Resources	startup-resources	Resources and services for startups	2025-02-26 06:49:14.061	2025-02-26 06:49:14.061
dbb78c7f-404a-4cd4-ade5-59d2268a7c66	Tutorials	tutorials	Step-by-step guides and tutorials	2025-02-26 06:49:14.063	2025-02-26 06:49:14.063
2b467382-6dd7-48ce-9e03-ba4460146211	Case Studies	case-studies	Real-world examples and success stories	2025-02-26 06:49:14.066	2025-02-26 06:49:14.066
0cb32bb2-a8d1-454a-8c3a-6cc3e96d1a52	Industry News	industry-news	Latest news and trends in the industry	2025-02-26 06:49:14.067	2025-02-26 06:49:14.067
74dc699c-f443-4138-90a4-46c50a39f62c	technology	tech	tech	2025-02-26 06:56:51.603	2025-02-26 06:56:51.603
37f211c2-7e65-4312-bddd-9ced625617a3	technology2	tech2	tech2	2025-02-26 06:57:09.302	2025-02-26 06:57:09.302
a23f1b13-010b-4473-bafa-0f4179f51030	test	test	test	2025-02-26 07:10:37.862	2025-02-26 07:10:37.862
b65d8d54-10ff-4559-a0a9-fef24ff07dfd	Test Category	test-category		2025-02-26 07:14:43.257	2025-02-26 07:14:43.257
0a39626d-8c96-4fc2-85f1-a29330e547a0	Test Category New	test-category-new		2025-02-26 07:14:58.223	2025-02-26 07:14:58.223
f633d2b7-698d-43ea-bdb6-9b6b2664eb48	Services	services	Professional services and consulting	2025-06-12 17:47:42.296	2025-06-12 17:47:42.296
cf8de3bd-aa25-4672-92df-f18a8ae81bd0	Consulting	consulting	Strategic consulting and business development services	2025-08-04 22:50:11.304	2025-08-04 22:50:11.304
27a82521-b2b0-4f52-9bf8-d27caadc3de1	Automation	automation	Workflow automation and integration services	2025-08-04 22:50:11.308	2025-08-04 22:50:11.308
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: gregstarr
--

COPY public.comments (id, content, "postId", "authorId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: contact_forms; Type: TABLE DATA; Schema: public; Owner: gregstarr
--

COPY public.contact_forms (id, name, email, message, status, "createdAt", "updatedAt") FROM stdin;
0c3d2017-8f17-4658-99fc-52d76af82f6e	John Doe	john.doe@example.com	I am interested in your web development services. Could you please provide more information about your pricing and timeline?	pending	2025-06-12 17:47:42.421	2025-06-12 17:47:42.421
\.


--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: gregstarr
--

COPY public.likes (id, "postId", "userId", "createdAt") FROM stdin;
\.


--
-- Data for Name: marketplace_items; Type: TABLE DATA; Schema: public; Owner: gregstarr
--

COPY public.marketplace_items (id, title, slug, description, price, "imageUrl", status, "categoryId", "sellerId", "createdAt", "updatedAt", specifications, features, stock, "discountPrice", weight, dimensions, featured, published, "sortOrder") FROM stdin;
a321d3ef-af59-40f1-81e0-c787bd9a737a	Custom Web Development	custom-web-development	Professional custom web development services using modern technologies like React, TypeScript, and Node.js. We build scalable, performant web applications tailored to your business needs.	2500.00	https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80	AVAILABLE	f633d2b7-698d-43ea-bdb6-9b6b2664eb48	8490cf88-e153-4b27-abe4-a377186a29a4	2025-06-12 17:47:42.367	2025-06-12 17:47:42.367	{"includes": ["Responsive design", "SEO optimization", "Performance optimization", "Testing"], "timeline": "4-8 weeks", "technologies": ["React", "TypeScript", "Node.js", "PostgreSQL"]}	{"Modern React with TypeScript","Responsive mobile-first design","SEO optimized","Performance optimized","Comprehensive testing","3 months support included"}	5	\N	\N	\N	t	t	\N
06e9c2c0-1020-4227-babd-237612b3c5f5	SEO Optimization Package	seo-optimization-package	Comprehensive SEO services to improve your website ranking.	499.99	https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80	AVAILABLE	a1050860-3ab4-4a26-be87-a5768f987d53	00b9d5f7-c370-44b8-a4d2-9d85e35aef40	2025-02-24 12:55:00.582	2025-02-24 12:55:00.582	{"duration": "3 months", "includes": ["Keyword Research", "On-page Optimization", "Content Strategy", "Monthly Reports"]}	{"Keyword Analysis","Technical SEO","Content Optimization","Performance Tracking"}	10	\N	\N	\N	t	t	\N
d014e9f9-3f6b-44e5-b0ad-ebf9ece1d634	Custom Website Development	custom-website-development	Professional website development services using modern technologies.	999.99	https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80	AVAILABLE	53b1abff-e9c8-4c21-9c75-0d820bbe617a	00b9d5f7-c370-44b8-a4d2-9d85e35aef40	2025-02-24 12:55:00.582	2025-02-24 12:55:00.582	{"support": "3 months", "timeline": "4-6 weeks", "technologies": ["React", "Node.js", "PostgreSQL"]}	{"Custom Design","Responsive Layout","SEO Optimization","Performance Optimization"}	5	\N	\N	\N	t	t	\N
6ef109c8-be81-4d2e-9fb2-bcb3e135da65	Email Marketing Setup & Automation	email-marketing-setup-automation	Complete email marketing setup including platform configuration, automated sequences, lead magnets, and template designs. Turn your email list into a revenue-generating machine with professional automation workflows.	1650.00	https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80	AVAILABLE	a1050860-3ab4-4a26-be87-a5768f987d53	8490cf88-e153-4b27-abe4-a377186a29a4	2025-08-04 22:50:11.361	2025-08-04 22:50:11.361	{"includes": ["Setup", "Templates", "Sequences", "Testing"], "timeline": "2-4 weeks", "platforms": ["Mailchimp", "ConvertKit", "ActiveCampaign", "Klaviyo"], "automations": ["Welcome series", "Abandoned cart", "Re-engagement", "Product recommendations"]}	{"Email platform setup and configuration","Custom email template designs","Automated email sequences (welcome, nurture, sales)","Lead magnet creation and integration","Segmentation strategy implementation","A/B testing setup for optimization","Performance tracking and analytics"}	12	\N	\N	\N	f	t	\N
8b8f8810-4a2f-4647-b0ec-24742ae7f264	UI/UX Design Package	ui-ux-design-package	Complete UI/UX design package including user research, wireframing, prototyping, and final designs. Perfect for startups and businesses looking to create exceptional user experiences.	1800.00	https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80	AVAILABLE	4c0ce9e4-f874-455b-b7b1-82bae38cffdd	8490cf88-e153-4b27-abe4-a377186a29a4	2025-06-12 17:47:42.377	2025-06-12 17:47:42.377	{"tools": ["Figma", "Adobe Creative Suite", "Principle"], "timeline": "3-6 weeks", "deliverables": ["User research", "Wireframes", "High-fidelity designs", "Interactive prototype"]}	{"User research and personas","Information architecture","Wireframes and user flows","High-fidelity mockups","Interactive prototypes","Design system creation"}	3	\N	\N	\N	t	t	\N
82fcf3ef-0682-44f5-a5d4-a3550fd5a433	Brand Identity Design Package	brand-identity-design-package	Complete brand identity package including logo design, color palette, typography, brand guidelines, and marketing materials. Perfect for startups and businesses looking to establish a strong visual identity that resonates with their target audience.	2200.00	https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80	AVAILABLE	4c0ce9e4-f874-455b-b7b1-82bae38cffdd	8490cf88-e153-4b27-abe4-a377186a29a4	2025-08-04 22:50:11.343	2025-08-04 22:50:11.343	{"formats": ["Vector files (AI, EPS)", "PNG/JPG exports", "PDF guidelines"], "timeline": "2-3 weeks", "revisions": "3 rounds included", "deliverables": ["Logo design (3 concepts)", "Color palette", "Typography selection", "Brand guidelines", "Business card design", "Letterhead design"]}	{"Professional logo design with 3 initial concepts","Complete color palette and typography guide","Comprehensive brand guidelines document","Business card and letterhead designs","Vector files and various format exports","3 rounds of revisions included","Source files and brand guidelines PDF"}	8	\N	\N	\N	t	t	\N
7c82af40-a33b-4d5c-94e9-73d7a253e083	Social Media Management Pro	social-media-management-pro	Comprehensive social media management service including content creation, scheduling, community management, and monthly analytics reports. Boost your online presence with professional social media strategy and execution.	899.00	https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80	AVAILABLE	a1050860-3ab4-4a26-be87-a5768f987d53	8490cf88-e153-4b27-abe4-a377186a29a4	2025-08-04 22:50:11.354	2025-08-04 22:50:11.354	{"billing": "Monthly subscription", "includes": ["Content calendar", "Analytics reports", "Community management"], "platforms": ["Instagram", "Facebook", "Twitter", "LinkedIn"], "content_types": ["Graphics", "Videos", "Carousels", "Stories"], "posting_frequency": "5-7 posts per week per platform"}	{"Daily content creation and posting","Professional graphic design for posts","Community management and engagement","Monthly performance analytics reports","Content calendar planning","Hashtag research and optimization","Cross-platform posting and scheduling"}	10	\N	\N	\N	t	t	\N
90376bed-a259-4df1-9f19-b8bb0af79dd7	E-commerce Store Development	ecommerce-store-development	Full-featured e-commerce store development with payment integration, inventory management, and mobile optimization. Built with modern technologies for scalability and performance, including admin dashboard and customer management.	4500.00	https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80	AVAILABLE	53b1abff-e9c8-4c21-9c75-0d820bbe617a	8490cf88-e153-4b27-abe4-a377186a29a4	2025-08-04 22:50:11.368	2025-08-04 22:50:11.368	{"hosting": "Deployment assistance included", "features": ["Product catalog", "Shopping cart", "Payment processing", "Order management"], "timeline": "6-10 weeks", "technologies": ["React", "Node.js", "PostgreSQL", "Stripe/PayPal"]}	{"Modern React-based storefront","Complete product catalog management","Secure payment processing (Stripe/PayPal)","Inventory and order management system","Customer account and wishlist functionality","Mobile-responsive design","Admin dashboard for store management","SEO optimization and performance tuning"}	3	\N	\N	\N	t	t	\N
f52c687e-2d0f-419d-b6f8-a68a0e249cce	Mobile App Development (iOS & Android)	mobile-app-development-ios-android	Native mobile app development for both iOS and Android platforms. From concept to app store deployment, we handle the entire development process including UI/UX design, backend integration, and post-launch support.	8500.00	https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80	AVAILABLE	f3de3256-eddb-49a8-80c5-90843d302e8f	8490cf88-e153-4b27-abe4-a377186a29a4	2025-08-04 22:50:11.375	2025-08-04 22:50:11.375	{"backend": "API development and integration", "includes": ["App store deployment", "Testing", "3 months support"], "timeline": "10-16 weeks", "platforms": ["iOS (Swift)", "Android (Kotlin)", "React Native (optional)"]}	{"Native iOS and Android app development","Custom UI/UX design for mobile experience","Backend API development and integration","Push notifications and real-time features","App store optimization and deployment","Comprehensive testing across devices","Post-launch support and maintenance","Analytics integration for user insights"}	2	\N	\N	\N	t	t	\N
d2f8300e-7074-46bd-b1e1-9700ba6a4fe8	Content Writing Services (Monthly)	content-writing-services-monthly	Professional content writing services including blog posts, website copy, social media content, and email newsletters. SEO-optimized content that engages your audience and drives conversions.	750.00	https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80	AVAILABLE	a1050860-3ab4-4a26-be87-a5768f987d53	8490cf88-e153-4b27-abe4-a377186a29a4	2025-08-04 22:50:11.382	2025-08-04 22:50:11.382	{"seo": "Keyword research and optimization included", "billing": "Monthly subscription", "word_count": "4 blog posts (800-1200 words each)", "content_types": ["Blog posts", "Website copy", "Social media content", "Email newsletters"]}	{"4 high-quality blog posts per month","SEO keyword research and optimization","Social media post content creation","Email newsletter writing","Content calendar and strategy planning","Plagiarism-free, original content","Multiple revisions included"}	15	\N	\N	\N	f	t	\N
d5691787-fd9d-49ae-97a1-2edcd70c95a0	PPC Campaign Management	ppc-campaign-management	Professional Google Ads and Facebook Ads campaign management including setup, optimization, and monthly reporting. Maximize your ROI with data-driven advertising strategies and continuous optimization.	1200.00	https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80	AVAILABLE	a1050860-3ab4-4a26-be87-a5768f987d53	8490cf88-e153-4b27-abe4-a377186a29a4	2025-08-04 22:50:11.388	2025-08-04 22:50:11.388	{"billing": "Monthly subscription", "includes": ["Campaign setup", "Ad creation", "Optimization", "Reporting"], "platforms": ["Google Ads", "Facebook Ads", "Instagram Ads", "LinkedIn Ads"], "management_fee": "Plus 15% of ad spend"}	{"Complete campaign setup and configuration","Keyword research and audience targeting","Ad creative development and testing","Daily monitoring and optimization","Conversion tracking setup","Monthly performance reports and insights","Landing page recommendations","Budget management and ROI optimization"}	8	\N	\N	\N	f	t	\N
bd6655a1-756b-4ab8-b5ed-93930bbd4ca0	Website Maintenance & Support	website-maintenance-support	Comprehensive website maintenance service including security updates, performance optimization, backup management, and technical support. Keep your website running smoothly with proactive maintenance and monitoring.	199.00	https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80	AVAILABLE	53b1abff-e9c8-4c21-9c75-0d820bbe617a	8490cf88-e153-4b27-abe4-a377186a29a4	2025-08-04 22:50:11.393	2025-08-04 22:50:11.393	{"billing": "Monthly subscription", "includes": ["Security updates", "Performance monitoring", "Backups", "Technical support"], "response_time": "2-hour response during business hours", "uptime_monitoring": "24/7 monitoring included"}	{"Regular security updates and patches","Performance monitoring and optimization","Automated daily backups","Malware scanning and removal","24/7 uptime monitoring","Technical support and troubleshooting","Monthly performance reports","Content updates (up to 2 hours/month)"}	25	\N	\N	\N	f	t	\N
02890b43-de1f-4f94-ae1b-d950e2f989da	Professional Logo Design	professional-logo-design	Custom logo design service with multiple concepts, unlimited revisions, and complete file package. Create a memorable brand identity that perfectly represents your business values and attracts your target audience.	650.00	https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80	AVAILABLE	4c0ce9e4-f874-455b-b7b1-82bae38cffdd	8490cf88-e153-4b27-abe4-a377186a29a4	2025-08-04 22:50:11.399	2025-08-04 22:50:11.399	{"files": ["Vector files (AI, EPS)", "PNG/JPG exports", "Black & white versions"], "concepts": "5 initial logo concepts", "timeline": "1-2 weeks", "revisions": "Unlimited revisions"}	{"5 unique logo concepts to choose from","Unlimited revisions until satisfied","Vector files for scalability","Multiple file formats (AI, EPS, PNG, JPG)","Black and white versions included","Social media and favicon sizes","Commercial usage rights included"}	20	\N	\N	\N	f	t	\N
2f2dbfa5-cd19-4e9f-b567-cccd92f12d23	Digital Marketing Strategy Consultation	digital-marketing-strategy-consultation	Comprehensive digital marketing strategy consultation including competitor analysis, audience research, channel recommendations, and actionable marketing plan. Get expert guidance to accelerate your business growth.	450.00	https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80	AVAILABLE	cf8de3bd-aa25-4672-92df-f18a8ae81bd0	8490cf88-e153-4b27-abe4-a377186a29a4	2025-08-04 22:50:11.405	2025-08-04 22:50:11.405	{"format": "Video call or in-person (local)", "follow_up": "1-hour follow-up call after 30 days", "deliverables": ["Strategy document", "Competitor analysis", "Action plan"], "session_length": "2-hour strategy session"}	{"Comprehensive business and competitor analysis","Target audience research and persona development","Multi-channel marketing strategy development","Budget allocation and ROI projections","Implementation timeline and milestones","Tool and platform recommendations","Detailed action plan with priorities","30-day follow-up consultation call"}	10	\N	\N	\N	f	t	\N
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: gregstarr
--

COPY public.posts (id, title, slug, content, excerpt, "featuredImage", status, "publishedAt", "createdAt", "updatedAt", "authorId", "categoryId", "metaTitle", "metaDescription", keywords, "viewCount", featured, pinned, "sortOrder", locale) FROM stdin;
51dda985-3635-49d5-b606-b724bc5f4020	Getting Started with React	getting-started-with-react	# Introduction to React\n\nReact is a popular JavaScript library for building user interfaces...	Learn the basics of React and start building modern web applications.	https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80	PUBLISHED	2025-02-24 12:55:00.556	2025-02-24 12:55:00.559	2025-02-24 12:55:00.559	00b9d5f7-c370-44b8-a4d2-9d85e35aef40	53b1abff-e9c8-4c21-9c75-0d820bbe617a	Getting Started with React - Complete Guide	Learn React fundamentals and best practices in this comprehensive guide.	\N	0	t	f	\N	en
fe64fe38-cbf0-49f5-9a63-13a0cdb51cad	TypeScript Best Practices for Large Applications	typescript-best-practices	# TypeScript Best Practices for Large Applications\n\nTypeScript has become essential for building maintainable large-scale applications. Here are the best practices we've learned from years of TypeScript development.\n\n## Type Safety First\n\nAlways prefer explicit types over `any`. Use strict mode in your TypeScript configuration:\n\n```json\n{\n  "compilerOptions": {\n    "strict": true,\n    "noImplicitAny": true,\n    "strictNullChecks": true\n  }\n}\n```\n\n## Interface vs Type\n\nUse interfaces for object shapes that might be extended, and types for unions, primitives, and computed types.\n\n## Utility Types\n\nLeverage TypeScript's built-in utility types like `Partial`, `Pick`, `Omit`, and `Record` to create more maintainable code.	Discover essential TypeScript best practices for building large, maintainable applications. Learn about type safety, interfaces, and utility types.	https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80	PUBLISHED	2025-06-12 17:47:42.337	2025-06-12 17:47:42.338	2025-06-12 17:47:42.338	8490cf88-e153-4b27-abe4-a377186a29a4	53b1abff-e9c8-4c21-9c75-0d820bbe617a	TypeScript Best Practices for Large Applications	Essential TypeScript best practices for building scalable, maintainable applications. Learn from real-world experience.	{typescript,"best practices","large applications","type safety"}	89	f	f	\N	en
b4d57e9f-21cf-429e-a21a-1810ad8e5d3e	SEO Best Practices 2024	seo-best-practices-2024	# SEO in 2024\n\nStay ahead of the competition with these SEO strategies...	Learn the latest SEO techniques to improve your website ranking.	https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80	PUBLISHED	2025-02-24 12:55:00.556	2025-02-24 12:55:00.559	2025-02-24 12:55:00.559	00b9d5f7-c370-44b8-a4d2-9d85e35aef40	a1050860-3ab4-4a26-be87-a5768f987d53	SEO Best Practices for 2024	Discover the latest SEO strategies to improve your website visibility.	\N	0	t	f	\N	en
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: gregstarr
--

COPY public.tags (id, name, slug, "createdAt", "updatedAt") FROM stdin;
42fd065a-a7c9-4b55-8170-f2d7def049c4	SEO	seo	2025-02-24 12:55:00.553	2025-02-24 12:55:00.553
8e9d42ae-7241-4da3-a499-b2dae7eacd9e	React	react	2025-02-24 12:55:00.553	2025-02-24 12:55:00.553
2adf5b0a-dafd-4c98-aea4-0faa1cd4c534	JavaScript	javascript	2025-02-26 06:49:14.071	2025-02-26 06:49:14.071
2e28782b-cc08-4b25-9041-6b19c6d8456d	TypeScript	typescript	2025-02-26 06:49:14.074	2025-02-26 06:49:14.074
1b37d4b9-75c9-4111-b427-80e470e9b502	Python	python	2025-02-26 06:49:14.076	2025-02-26 06:49:14.076
6efefd4f-3c2a-4f8b-86a7-0616448a3609	Django	django	2025-02-26 06:49:14.077	2025-02-26 06:49:14.077
b0e7a3a7-fb48-4613-921a-2003ba626ce6	Vue.js	vuejs	2025-02-26 06:49:14.079	2025-02-26 06:49:14.079
8eccb6f8-8df7-462d-9d23-e6ec6a4c411f	Angular	angular	2025-02-26 06:49:14.08	2025-02-26 06:49:14.08
b0caf444-9627-499e-a349-971f5ed3b929	Next.js	nextjs	2025-02-26 06:49:14.082	2025-02-26 06:49:14.082
123117e3-cdc6-41c6-bd16-9a9cb8db2cc2	AWS	aws	2025-02-26 06:49:14.084	2025-02-26 06:49:14.084
eec7f50c-b56b-4a06-bfe3-93dfb6193acd	Docker	docker	2025-02-26 06:49:14.085	2025-02-26 06:49:14.085
77974f9d-48ce-4620-825c-3b9cea0242bb	Kubernetes	kubernetes	2025-02-26 06:49:14.087	2025-02-26 06:49:14.087
064d45e6-1715-4786-9830-99f8acd73144	UI Design	ui-design	2025-02-26 06:49:14.089	2025-02-26 06:49:14.089
7a8c7bb9-6ff1-4fc8-8d20-a04e6a66c3c9	UX Design	ux-design	2025-02-26 06:49:14.09	2025-02-26 06:49:14.09
58eca6d6-7e38-471b-860e-bbfdb1ff1c3f	Figma	figma	2025-02-26 06:49:14.091	2025-02-26 06:49:14.091
9e6e62c6-bb7a-4268-8492-5013d00b046b	Adobe XD	adobe-xd	2025-02-26 06:49:14.093	2025-02-26 06:49:14.093
37f18c2e-55fe-4d52-b377-084c76392450	Sketch	sketch	2025-02-26 06:49:14.094	2025-02-26 06:49:14.094
7fb190ae-1bbb-495b-8250-4251e020ee73	Responsive Design	responsive-design	2025-02-26 06:49:14.095	2025-02-26 06:49:14.095
e423af36-9441-4923-a37e-3e12d9953427	SEM	sem	2025-02-26 06:49:14.097	2025-02-26 06:49:14.097
efd0e250-e815-4621-a37a-7543901d7ca7	Content Strategy	content-strategy	2025-02-26 06:49:14.099	2025-02-26 06:49:14.099
57f890f7-e4e2-430d-adbc-fedab4eaf1de	Email Marketing	email-marketing	2025-02-26 06:49:14.1	2025-02-26 06:49:14.1
3a60a278-ba34-4d8c-a902-7d25fa5323ee	Social Media Marketing	social-media-marketing	2025-02-26 06:49:14.102	2025-02-26 06:49:14.102
dc3bcccd-03af-4482-b75e-22cf79012ce2	Analytics	analytics	2025-02-26 06:49:14.103	2025-02-26 06:49:14.103
abbdb7a0-38b2-4b34-ace2-4093051132ba	Conversion Rate Optimization	cro	2025-02-26 06:49:14.105	2025-02-26 06:49:14.105
9414049a-5a65-413c-948a-d921c2fbf52e	Startups	startups	2025-02-26 06:49:14.106	2025-02-26 06:49:14.106
1342724c-ad88-48e7-a0ed-519df36ca753	Entrepreneurship	entrepreneurship	2025-02-26 06:49:14.108	2025-02-26 06:49:14.108
06554a9d-bf1b-4f4a-9338-a5726a4591ca	Funding	funding	2025-02-26 06:49:14.109	2025-02-26 06:49:14.109
73afba90-bb38-4c1a-8dae-3afc1b454740	Growth Hacking	growth-hacking	2025-02-26 06:49:14.11	2025-02-26 06:49:14.11
a6aedef1-b54b-4590-9a76-08c2d844bf8a	Remote Work	remote-work	2025-02-26 06:49:14.112	2025-02-26 06:49:14.112
a9ea9f94-fa0b-4160-9184-215498194fea	Tutorial	tutorial	2025-02-26 06:49:14.113	2025-02-26 06:49:14.113
52def829-cf56-43ae-a5c8-93d98587e23c	Guide	guide	2025-02-26 06:49:14.114	2025-02-26 06:49:14.114
386c94e2-1c6c-42fd-ba52-968809ec4b4b	Case Study	case-study	2025-02-26 06:49:14.116	2025-02-26 06:49:14.116
e83d539a-88d9-43ac-a7a3-bdda8e6c2960	Interview	interview	2025-02-26 06:49:14.117	2025-02-26 06:49:14.117
701ec37a-99c8-4cbe-a97d-3ff36e0707ae	Opinion	opinion	2025-02-26 06:49:14.119	2025-02-26 06:49:14.119
46a744f3-33d0-4ee2-a1c6-de1554c70f2e	News	news	2025-02-26 06:49:14.12	2025-02-26 06:49:14.12
499f65b6-be1f-42f1-b7fa-fc879655ede4	UI/UX	ui-ux	2025-06-12 17:47:42.32	2025-06-12 17:47:42.32
28756872-eecd-4abf-9fa6-fd50c5e0e652	Branding	branding	2025-08-04 22:50:11.322	2025-08-04 22:50:11.322
b367accf-f8cf-48a4-a715-144e0a7a9f6d	E-commerce	ecommerce	2025-08-04 22:50:11.325	2025-08-04 22:50:11.325
a6807f76-1f2c-452b-be0c-8567dc07ca3e	Mobile App	mobile-app	2025-08-04 22:50:11.327	2025-08-04 22:50:11.327
c6bc17e9-7455-455e-a761-36056aa054b2	Automation	automation	2025-08-04 22:50:11.33	2025-08-04 22:50:11.33
9aa9153c-87d3-4078-9d0d-81bcd1e766a4	Content Marketing	content-marketing	2025-08-04 22:50:11.331	2025-08-04 22:50:11.331
820c59a6-dc3b-4600-a0f9-f2f3c4814f7c	PPC	ppc	2025-08-04 22:50:11.333	2025-08-04 22:50:11.333
bac42379-2e13-4b54-9db8-9e9f1ddff251	Social Media	social-media	2025-08-04 22:50:11.336	2025-08-04 22:50:11.336
131c8ef4-4f49-43ec-9624-91451ff24334	Subscription	subscription	2025-08-04 22:50:11.338	2025-08-04 22:50:11.338
1e2812a3-3efc-40c1-afb3-99931af73c23	Consultation	consultation	2025-08-04 22:50:11.34	2025-08-04 22:50:11.34
637eeede-eaa9-475e-bc4f-03eca774f072	tech	terch	2025-02-26 06:57:38.381	2025-02-26 06:57:38.381
41d116da-38f6-44c8-95b0-210ab3428cd4	greg	greg	2025-02-26 07:26:24.378	2025-02-26 07:26:24.378
6941676a-1641-4464-bf7b-b990e1c42dd2	Node.js	nodejs	2025-02-24 12:55:00.553	2025-02-24 12:55:00.553
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: gregstarr
--

COPY public.testimonials (id, content, rating, "authorId", role, company, avatar, featured, published, "sortOrder", "createdAt", "updatedAt") FROM stdin;
seed-1	Working with Astralis has been transformative for our brand. Their attention to detail and creative solutions exceeded our expectations.	5	00b9d5f7-c370-44b8-a4d2-9d85e35aef40	CEO at TechStart	TechStart	https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80	t	t	1	2025-02-26 09:38:55.131	2025-02-26 09:38:55.131
seed-2	The team's expertise in digital marketing helped us achieve record-breaking growth. Highly recommended!	5	00b9d5f7-c370-44b8-a4d2-9d85e35aef40	Marketing Director	InnovateTech	https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80	t	t	2	2025-02-26 09:38:55.136	2025-02-26 09:38:55.136
seed-3	Their innovative approach to problem-solving and dedication to quality makes them stand out from the competition.	5	00b9d5f7-c370-44b8-a4d2-9d85e35aef40	Product Manager	SaaS Solutions	https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80	t	t	3	2025-02-26 09:38:55.138	2025-02-26 09:38:55.138
seed-4	Astralis Agency delivered exceptional results for our website redesign. Their technical expertise and creative vision transformed our online presence.	5	00b9d5f7-c370-44b8-a4d2-9d85e35aef40	CTO at InnovateTech	InnovateTech	https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80	f	t	4	2025-02-26 09:38:55.14	2025-02-26 09:38:55.14
seed-5	The digital marketing strategy Astralis created for us resulted in a 200% increase in online sales within just three months.	5	00b9d5f7-c370-44b8-a4d2-9d85e35aef40	E-commerce Manager	RetailPlus	https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80	f	t	5	2025-02-26 09:38:55.142	2025-02-26 09:38:55.142
testimonial-1	Astralis Agency delivered an exceptional web application that exceeded our expectations. Their attention to detail and technical expertise is outstanding.	5	317d6ad6-6541-42ed-8314-2940796a743a	CEO	TechStart Inc.	\N	t	t	1	2025-06-12 17:47:42.405	2025-06-12 17:47:42.405
testimonial-2	The UI/UX design work was phenomenal. Our user engagement increased by 40% after implementing their designs.	5	317d6ad6-6541-42ed-8314-2940796a743a	Product Manager	Digital Solutions Ltd.	\N	t	t	2	2025-06-12 17:47:42.414	2025-06-12 17:47:42.414
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: gregstarr
--

COPY public.users (id, email, name, password, avatar, bio, role, "createdAt", "updatedAt") FROM stdin;
00b9d5f7-c370-44b8-a4d2-9d85e35aef40	admin@astralis.com	Admin User	$2b$10$pyqf7sUDowcKQuCcGByNfOYU7/kZzfJ8c5J/r0tMqepqU5cPo4x5G	\N	\N	ADMIN	2025-02-24 12:55:00.525	2025-02-24 12:55:00.525
8490cf88-e153-4b27-abe4-a377186a29a4	admin@astralis.one	Admin User	$2b$10$xqq8byRIsyWWCqa98rTfl.yUjfqvSmWgRwApQ5jp2nRGAJxymD.YS	\N	\N	ADMIN	2025-02-26 08:53:19.724	2025-02-26 08:53:19.724
317d6ad6-6541-42ed-8314-2940796a743a	user@astralis.one	Test User	$2b$12$qSu938CRbx0xOeMx7FD3YO8CI53pDBIyr.WrS8Hjp9iiQ1oueZ0EC	\N	Test user for development	USER	2025-06-12 17:47:42.273	2025-06-12 17:47:42.273
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: gregstarr
--

COPY public.wishlists (id, "userId", "itemId", "createdAt") FROM stdin;
\.


--
-- Name: _MarketplaceItemToTag _MarketplaceItemToTag_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public."_MarketplaceItemToTag"
    ADD CONSTRAINT "_MarketplaceItemToTag_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _PostToTag _PostToTag_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public."_PostToTag"
    ADD CONSTRAINT "_PostToTag_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: contact_forms contact_forms_pkey; Type: CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.contact_forms
    ADD CONSTRAINT contact_forms_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: marketplace_items marketplace_items_pkey; Type: CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.marketplace_items
    ADD CONSTRAINT marketplace_items_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wishlists wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_pkey PRIMARY KEY (id);


--
-- Name: _MarketplaceItemToTag_B_index; Type: INDEX; Schema: public; Owner: gregstarr
--

CREATE INDEX "_MarketplaceItemToTag_B_index" ON public."_MarketplaceItemToTag" USING btree ("B");


--
-- Name: _PostToTag_B_index; Type: INDEX; Schema: public; Owner: gregstarr
--

CREATE INDEX "_PostToTag_B_index" ON public."_PostToTag" USING btree ("B");


--
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: gregstarr
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- Name: likes_postId_userId_key; Type: INDEX; Schema: public; Owner: gregstarr
--

CREATE UNIQUE INDEX "likes_postId_userId_key" ON public.likes USING btree ("postId", "userId");


--
-- Name: marketplace_items_slug_key; Type: INDEX; Schema: public; Owner: gregstarr
--

CREATE UNIQUE INDEX marketplace_items_slug_key ON public.marketplace_items USING btree (slug);


--
-- Name: posts_slug_key; Type: INDEX; Schema: public; Owner: gregstarr
--

CREATE UNIQUE INDEX posts_slug_key ON public.posts USING btree (slug);


--
-- Name: tags_name_key; Type: INDEX; Schema: public; Owner: gregstarr
--

CREATE UNIQUE INDEX tags_name_key ON public.tags USING btree (name);


--
-- Name: tags_slug_key; Type: INDEX; Schema: public; Owner: gregstarr
--

CREATE UNIQUE INDEX tags_slug_key ON public.tags USING btree (slug);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: gregstarr
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: wishlists_userId_itemId_key; Type: INDEX; Schema: public; Owner: gregstarr
--

CREATE UNIQUE INDEX "wishlists_userId_itemId_key" ON public.wishlists USING btree ("userId", "itemId");


--
-- Name: _MarketplaceItemToTag _MarketplaceItemToTag_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public."_MarketplaceItemToTag"
    ADD CONSTRAINT "_MarketplaceItemToTag_A_fkey" FOREIGN KEY ("A") REFERENCES public.marketplace_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _MarketplaceItemToTag _MarketplaceItemToTag_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public."_MarketplaceItemToTag"
    ADD CONSTRAINT "_MarketplaceItemToTag_B_fkey" FOREIGN KEY ("B") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _PostToTag _PostToTag_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public."_PostToTag"
    ADD CONSTRAINT "_PostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _PostToTag _PostToTag_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public."_PostToTag"
    ADD CONSTRAINT "_PostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: comments comments_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: likes likes_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT "likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: likes likes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: marketplace_items marketplace_items_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.marketplace_items
    ADD CONSTRAINT "marketplace_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: marketplace_items marketplace_items_sellerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.marketplace_items
    ADD CONSTRAINT "marketplace_items_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: posts posts_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: posts posts_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: testimonials testimonials_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT "testimonials_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: wishlists wishlists_itemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT "wishlists_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public.marketplace_items(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: wishlists wishlists_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gregstarr
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT "wishlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

