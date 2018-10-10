
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA winedetective;
ALTER SCHEMA winedetective OWNER TO postgres;


CREATE FUNCTION winedetective.build_varietal() RETURNS void
    LANGUAGE plpgsql
    AS $$

  
DECLARE
	color text; 
	winecolors text[];
	json text;
	dummy text;
												  
BEGIN
	winecolors = winedetective.get_winecategories();
	
	FOREACH color IN ARRAY winecolors LOOP
		json = '';
		json = winedetective.get_varietals(color);
		dummy = winedetective.upsert_varietal(color,json);
										
		RAISE NOTICE '%(%)', 'UPSERT', json;
	END LOOP;

END; 

$$;

ALTER FUNCTION winedetective.build_varietal() OWNER TO postgres;
COMMENT ON FUNCTION winedetective.build_varietal() IS '(re)build the varietal table from criteria found in the bottle table';


CREATE FUNCTION winedetective.find_bin(searchpattern text) RETURNS json
    LANGUAGE sql
    AS $_$

select array_to_json(array_agg(row_to_json(t)))
   from (
     select 
	   id, bin 
	 from 
	   winedetective.bottle
	 where 
		concat(winecategory,varietal,vintage,producer,vineyard) = searchpattern
   ) t

$_$;

ALTER FUNCTION winedetective.find_bin(searchpattern text) OWNER TO postgres;

CREATE FUNCTION winedetective.get_bins(searchpattern text) RETURNS text
    LANGUAGE plpgsql
    AS $$

DECLARE 
  counter       INTEGER := 0 ; 
  json          TEXT DEFAULT '';
  stanza        TEXT DEFAULT '';
  recordbottle  RECORD;
  cursorbottles CURSOR for select id,bin from winedetective.bottle where concat(winecategory,varietal,vintage,producer,vineyard) = searchpattern ;

  BEGIN
    -- Open the cursor
    OPEN cursorbottles;

    json = '[';

    LOOP
      -- fetch row into the film
      FETCH cursorbottles INTO recordbottle;
      -- exit when no more row to fetch
      EXIT WHEN NOT FOUND;

      -- build the output
      if (counter = 0) then
        stanza := stanza ||  '{' || '"id":"' ||  recordbottle.id || '",';
        stanza := stanza ||   '"location":"' ||  recordbottle.bin || '"}';
      else
        stanza := stanza || ',{' || '"id":"' ||  recordbottle.id || '",';
        stanza := stanza ||   '"location":"' ||  recordbottle.bin || '"}';		
      end if;

      counter := counter + 1 ; 

    END LOOP;

    json := json || stanza || ']';
    
    -- Close the cursor
    CLOSE cursorbottles;

RETURN json;
END; 

$$;

ALTER FUNCTION winedetective.get_bins(searchpattern text) OWNER TO postgres;


CREATE FUNCTION winedetective.get_smart(p_varietal text) RETURNS TABLE(vintage integer, varietal text, producer text, vineyard text, bottles text)
    LANGUAGE plpgsql
    AS $$

DECLARE 
    var_r record;
BEGIN
 FOR var_r IN (
	SELECT distinct
		bottle.vintage,
		bottle.varietal, 
		bottle.producer,
		bottle.vineyard,
		winedetective.get_bins(concat(bottle.winecategory,bottle.varietal,bottle.vintage,bottle.producer,bottle.vineyard)) as bottles
    FROM 
		winedetective.bottle
	WHERE
		bottle.varietal = p_varietal
	)  
 LOOP
 		vintage  = var_r.vintage;
		varietal = var_r.varietal ; 
		producer = var_r.producer ; 
		vineyard = var_r.vineyard ; 
		bottles  = var_r.bottles;
        RETURN NEXT;
 END LOOP;
END; 

$$;


ALTER FUNCTION winedetective.get_smart(p_varietal text) OWNER TO postgres;


CREATE FUNCTION winedetective.get_smart2(p_varietal text) RETURNS TABLE(vintage integer, varietal text, producer text, vineyard text, bottles json)
    LANGUAGE plpgsql
    AS $$

DECLARE 
    var_r record;
BEGIN
 FOR var_r IN (
	SELECT distinct on
		(concat(bottle.winecategory,bottle.varietal,bottle.vintage,bottle.producer,bottle.vineyard))
		bottle.vintage,
		bottle.varietal, 
		bottle.producer,
		bottle.vineyard,
		winedetective.find_bin(concat(bottle.winecategory,bottle.varietal,bottle.vintage,bottle.producer,bottle.vineyard)) as bottles
    FROM 
		winedetective.bottle
	WHERE
		bottle.varietal = p_varietal
	)  
 LOOP
 		vintage  = var_r.vintage;
		varietal = var_r.varietal ; 
		producer = var_r.producer ; 
		vineyard = var_r.vineyard ; 
		bottles  = var_r.bottles ;
        RETURN NEXT;
 END LOOP;
END; 

$$;


ALTER FUNCTION winedetective.get_smart2(p_varietal text) OWNER TO postgres;


CREATE FUNCTION winedetective.get_varietals(wine_category text) RETURNS text
    LANGUAGE plpgsql
    AS $$

-- winecategory is 'red, 'white', 'other'
-- returns something like this : {"red":[{"name":"Cabernet"},{"name":"Pinot Noir"},{"name":"Tempernillo"}]}

DECLARE 
  counter       INTEGER := 0 ; 
  json          TEXT DEFAULT '';
  stanza        TEXT DEFAULT '';
  recordbottle  RECORD;
  cursorbottles CURSOR for select distinct varietal from winedetective.bottle where bottle.available = true and bottle.winecategory = wine_category ;

  BEGIN
    -- Open the cursor
    OPEN cursorbottles;

    json = '{"' || wine_category || '":[';

    LOOP
      -- fetch row into the film
      FETCH cursorbottles INTO recordbottle;
      -- exit when no more row to fetch
      EXIT WHEN NOT FOUND;

      -- build the output
      if (counter = 0) then
        stanza := stanza || '{' || '"name":"' ||  recordbottle.varietal || '"}';
      else
        stanza := stanza || ',{' || '"name":"' ||  recordbottle.varietal || '"}';
      end if;

      counter := counter + 1 ; 

    END LOOP;

    json := json || stanza || ']}';
    
    -- Close the cursor
    CLOSE cursorbottles;

RETURN json;
END; 

$$;


ALTER FUNCTION winedetective.get_varietals(wine_category text) OWNER TO postgres;

COMMENT ON FUNCTION winedetective.get_varietals(wine_category text) IS 'build a json string of varietals based on the passed winecategory ';

CREATE FUNCTION winedetective.get_winecategories() RETURNS text[]
    LANGUAGE sql
    AS $$
	SELECT ARRAY(SELECT distinct bottle.winecategory  
		FROM winedetective.bottle
		ORDER BY bottle.winecategory  DESC
	);
$$;


ALTER FUNCTION winedetective.get_winecategories() OWNER TO postgres;

COMMENT ON FUNCTION winedetective.get_winecategories() IS 'each bottle has a winecategory, return a unique list of them as a text array';

CREATE FUNCTION winedetective.upsert_varietal(key text, data text) RETURNS void
    LANGUAGE plpgsql
    AS $$

BEGIN
    LOOP
        -- first try to update the key
        UPDATE winedetective.varietal_by_winecategory SET varietals = data WHERE winecategory = key;
        IF found THEN
            RETURN;
        END IF;
        -- not there, so try to insert the key
        -- if someone else inserts the same key concurrently,
        -- we could get a unique-key failure
        BEGIN
            INSERT INTO winedetective.varietal_by_winecategory(winecategory,varietals) VALUES (key, data);
            RETURN;
        EXCEPTION WHEN unique_violation THEN
            -- Do nothing, and loop to try the UPDATE again.
        END;
    END LOOP;
END;

$$;

ALTER FUNCTION winedetective.upsert_varietal(key text, data text) OWNER TO postgres;
SET default_tablespace = '';
SET default_with_oids = false;

CREATE TABLE winedetective.ava (
    id integer NOT NULL,
    description character varying(100) NOT NULL,
    winecategory text
);
ALTER TABLE winedetective.ava OWNER TO postgres;

CREATE SEQUENCE winedetective.ava_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE winedetective.ava_id_seq OWNER TO postgres;
ALTER SEQUENCE winedetective.ava_id_seq OWNED BY winedetective.ava.id;

CREATE TABLE winedetective.bin (
    id integer NOT NULL,
    description character varying(100) NOT NULL
);
ALTER TABLE winedetective.bin OWNER TO postgres;
CREATE SEQUENCE winedetective.bin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE winedetective.bin_id_seq OWNER TO postgres;
ALTER SEQUENCE winedetective.bin_id_seq OWNED BY winedetective.bin.id;

CREATE TABLE winedetective.bottle (
    id integer NOT NULL,
    varietal text NOT NULL,
    available boolean DEFAULT true,
    winecategory text,
    vintage integer,
    producer text,
    vineyard text,
    bin text,
    ava text
);
ALTER TABLE winedetective.bottle OWNER TO postgres;
COMMENT ON COLUMN winedetective.bottle.winecategory IS 'for example, red, white, other';
CREATE SEQUENCE winedetective.bottle_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE winedetective.bottle_id_seq OWNER TO postgres;
ALTER SEQUENCE winedetective.bottle_id_seq OWNED BY winedetective.bottle.id;

CREATE SEQUENCE winedetective.members_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE winedetective.members_id_seq OWNER TO postgres;
CREATE TABLE winedetective.members (
    id integer DEFAULT nextval('winedetective.members_id_seq'::regclass) NOT NULL,
    name_first text,
    name_last text,
    name_business text,
    occupation text,
    email text,
    phone_main text,
    phone_secondary text,
    member_since date DEFAULT now(),
    active boolean DEFAULT true,
    comments text,
    onlineid text,
    password text,
    pword_type integer,
    member_type integer
);
ALTER TABLE winedetective.members OWNER TO postgres;
COMMENT ON COLUMN winedetective.members.occupation IS 'looking for president, CFO, CEO, lead dishwasher, head honcho';
COMMENT ON COLUMN winedetective.members.pword_type IS 'is  the password is permanent (1)  or temporary (0)?';
COMMENT ON COLUMN winedetective.members.member_type IS 'regularUser = 0; admin = 1';

CREATE TABLE winedetective.varietal (
    id integer NOT NULL,
    description character varying(100) NOT NULL,
    winecategory text NOT NULL
);
ALTER TABLE winedetective.varietal OWNER TO postgres;

CREATE TABLE winedetective.varietal_by_winecategory (
    winecategory text NOT NULL,
    varietals text NOT NULL
);
ALTER TABLE winedetective.varietal_by_winecategory OWNER TO postgres;

CREATE SEQUENCE winedetective.varietal_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE winedetective.varietal_id_seq OWNER TO postgres;

CREATE SEQUENCE winedetective.varietals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE winedetective.varietals_id_seq OWNER TO postgres;
ALTER SEQUENCE winedetective.varietals_id_seq OWNED BY winedetective.varietal.id;

ALTER TABLE ONLY winedetective.ava ALTER COLUMN id SET DEFAULT nextval('winedetective.ava_id_seq'::regclass);
ALTER TABLE ONLY winedetective.bin ALTER COLUMN id SET DEFAULT nextval('winedetective.bin_id_seq'::regclass);
ALTER TABLE ONLY winedetective.bottle ALTER COLUMN id SET DEFAULT nextval('winedetective.bottle_id_seq'::regclass);
ALTER TABLE ONLY winedetective.varietal ALTER COLUMN id SET DEFAULT nextval('winedetective.varietals_id_seq'::regclass);

ALTER TABLE ONLY winedetective.ava
    ADD CONSTRAINT ava_pkey PRIMARY KEY (id);

ALTER TABLE ONLY winedetective.bin
    ADD CONSTRAINT bin_pkey PRIMARY KEY (id);

ALTER TABLE ONLY winedetective.bottle
    ADD CONSTRAINT bottle_pkey PRIMARY KEY (id);

ALTER TABLE ONLY winedetective.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);

ALTER TABLE ONLY winedetective.varietal_by_winecategory
    ADD CONSTRAINT varietal_pkey1 PRIMARY KEY (winecategory);

ALTER TABLE ONLY winedetective.varietal
    ADD CONSTRAINT varietals_pkey PRIMARY KEY (id);


SELECT pg_catalog.setval('winedetective.ava_id_seq', 1, true);
SELECT pg_catalog.setval('winedetective.bin_id_seq', 1, true);
SELECT pg_catalog.setval('winedetective.bottle_id_seq', 1, true);
SELECT pg_catalog.setval('winedetective.members_id_seq', 1, true);
SELECT pg_catalog.setval('winedetective.varietal_id_seq', 1, true);
SELECT pg_catalog.setval('winedetective.varietals_id_seq', 1, true);

INSERT INTO winedetective.ava (id, description, winecategory) VALUES (1, 'Chehalem Mountains', 'Oregon');
INSERT INTO winedetective.ava (id, description, winecategory) VALUES (2, 'Columbia Valley', 'Washington');
INSERT INTO winedetective.ava (id, description, winecategory) VALUES (3, 'Dundee Hills', 'Oregon');
INSERT INTO winedetective.ava (id, description, winecategory) VALUES (4, 'Eola-Amity Hills', 'Oregon');
INSERT INTO winedetective.ava (id, description, winecategory) VALUES (5, 'Umpqua Valley', 'Oregon');
INSERT INTO winedetective.ava (id, description, winecategory) VALUES (6, 'Walla Walla', 'Washington');
INSERT INTO winedetective.ava (id, description, winecategory) VALUES (7, 'Wilamette Valley', 'Oregon');

INSERT INTO winedetective.bin (id, description) VALUES (1, 'A');
INSERT INTO winedetective.bin (id, description) VALUES (2, 'B');
INSERT INTO winedetective.bin (id, description) VALUES (3, 'C');
INSERT INTO winedetective.bin (id, description) VALUES (4, 'D');
INSERT INTO winedetective.bin (id, description) VALUES (5, 'E');
INSERT INTO winedetective.bin (id, description) VALUES (6, 'F');
INSERT INTO winedetective.bin (id, description) VALUES (7, 'G');
INSERT INTO winedetective.bin (id, description) VALUES (8, 'H');
INSERT INTO winedetective.bin (id, description) VALUES (9, 'Q');
INSERT INTO winedetective.bin (id, description) VALUES (10, 'Z');

INSERT INTO winedetective.bottle (id, varietal, available, winecategory, vintage, producer, vineyard, bin, ava) VALUES (1, 'Tempernillo', true, 'red', 2016, 'Abecella', 'Estate', 'A', 'Umpqua Valley');
INSERT INTO winedetective.bottle (id, varietal, available, winecategory, vintage, producer, vineyard, bin, ava) VALUES (2, 'Tempernillo', true, 'red', 2016, 'Zerba', 'The Rocks', 'B', 'Walla Walla');
INSERT INTO winedetective.bottle (id, varietal, available, winecategory, vintage, producer, vineyard, bin, ava) VALUES (3, 'Cabernet Sauvignon', true, 'red', 2016, 'Wilamette Valley Vintners', 'Estate', 'C', 'Wilamette Valley');
INSERT INTO winedetective.bottle (id, varietal, available, winecategory, vintage, producer, vineyard, bin, ava) VALUES (4, 'Pinot Noir', true, 'red', 2016, 'Hawk''s View', NULL, 'D', 'Chehalem Mountains');
INSERT INTO winedetective.bottle (id, varietal, available, winecategory, vintage, producer, vineyard, bin, ava) VALUES (5, 'Chardonnay', true, 'white', 2015, 'Reininger', NULL, 'E', 'Columbia Valley');
INSERT INTO winedetective.bottle (id, varietal, available, winecategory, vintage, producer, vineyard, bin, ava) VALUES (6, 'Pinot Grigio', true, 'white', 2015, 'Durant', NULL, 'F', 'Dundee Hills');
INSERT INTO winedetective.bottle (id, varietal, available, winecategory, vintage, producer, vineyard, bin, ava) VALUES (7, 'Rose', true, 'other', 2014, 'Eola Hills', NULL, 'G', 'Eola-Amity Hills');
INSERT INTO winedetective.bottle (id, varietal, available, winecategory, vintage, producer, vineyard, bin, ava) VALUES (8, 'Tempernillo', true, 'red', 2016, 'Abecella', 'Estate', 'H', 'Umpqua Valley');
INSERT INTO winedetective.bottle (id, varietal, available, winecategory, vintage, producer, vineyard, bin, ava) VALUES (9, 'Chardonnay', true, 'white', 2015, 'Reininger', NULL, 'Z', 'Columbia Valley');
INSERT INTO winedetective.bottle (id, varietal, available, winecategory, vintage, producer, vineyard, bin, ava) VALUES (19, 'Champagne', true, 'other', 2016, 'Argyle', NULL, 'Q', ' Dundee Hills');


INSERT INTO winedetective.members (id, name_first, name_last, name_business, occupation, email, phone_main, phone_secondary, member_since, active, comments, onlineid, password, pword_type, member_type) VALUES (3, 'guest', 'guest', NULL, NULL, 'guest', NULL, NULL, '2018-10-01', true, NULL, 'guest', 'guest', 0, 0);
INSERT INTO winedetective.members (id, name_first, name_last, name_business, occupation, email, phone_main, phone_secondary, member_since, active, comments, onlineid, password, pword_type, member_type) VALUES (1, 'admin', 'admin', NULL, NULL, 'admin', NULL, NULL, '2018-10-01', true, NULL, 'admin', 'admin', 0, 1);

INSERT INTO winedetective.varietal (id, description, winecategory) VALUES (1, 'Rose', 'other');
INSERT INTO winedetective.varietal (id, description, winecategory) VALUES (2, 'Tempernillo', 'red');
INSERT INTO winedetective.varietal (id, description, winecategory) VALUES (3, 'Champagne', 'other');
INSERT INTO winedetective.varietal (id, description, winecategory) VALUES (4, 'Chardonnay', 'white');
INSERT INTO winedetective.varietal (id, description, winecategory) VALUES (5, 'Pinot Noir', 'red');
INSERT INTO winedetective.varietal (id, description, winecategory) VALUES (6, 'Pinot Grigio', 'white');
INSERT INTO winedetective.varietal (id, description, winecategory) VALUES (7, 'Cabernet', 'red');


INSERT INTO winedetective.varietal_by_winecategory (winecategory, varietals) VALUES ('white', '{"white":[{"name":"Chardonnay"},{"name":"Pinot Grigio"}]}');
INSERT INTO winedetective.varietal_by_winecategory (winecategory, varietals) VALUES ('red', '{"red":[{"name":"Cabernet Sauvignon"},{"name":"Pinot Noir"},{"name":"Tempernillo"}]}');
INSERT INTO winedetective.varietal_by_winecategory (winecategory, varietals) VALUES ('other', '{"other":[{"name":"Champagne"},{"name":"Rose"}]}');


