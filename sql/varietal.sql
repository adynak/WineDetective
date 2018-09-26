-- Table: winedetective.varietal

-- DROP TABLE winedetective.varietal;

CREATE TABLE winedetective.varietal
(
    winecategory text COLLATE pg_catalog."default" NOT NULL,
    varietals text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT varietal_pkey1 PRIMARY KEY (winecategory)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE winedetective.varietal
    OWNER to postgres;

**************************************************************************************************************

CREATE OR REPLACE FUNCTION winedetective.get_varietal(winecategory text)
  RETURNS text AS $$

-- winecategory is 'red, 'white', 'other'
-- returns something like this : {"red":[{"name":"Cabernet"},{"name":"Pinot Noir"},{"name":"Tempernillo"}]}

DECLARE 
  counter       INTEGER := 0 ; 
  json          TEXT DEFAULT '';
  stanza        TEXT DEFAULT '';
  recordbottle  RECORD;
  cursorbottles CURSOR for select distinct varietal from winedetective.bottle where bottle.available = true and bottle.category = winecategory ;

  BEGIN
    -- Open the cursor
    OPEN cursorbottles;

    json = '{"' || winecategory || '":[';

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
END; $$

LANGUAGE plpgsql;

**************************************************************************************************************

CREATE OR REPLACE FUNCTION get_all_varietals(winecolor text[]) 
RETURNS void AS $$  

DECLARE  
  number_strings integer := array_length(winecolor, 1);  
  cnt integer := 1;  
  stmt text := '';

BEGIN  

  WHILE cnt <= number_strings LOOP  
    stmt = 'UPDATE winedetective.varietal ' ||
           'SET varietals=subquery.get_varietal ' ||
           'FROM (SELECT winedetective.get_varietal(' || winecolor[cnt] || ')) ' ||
           'AS subquery WHERE winecategory = ' || winecolor[cnt];              
    EXECUTE stmt;               

    cnt = cnt + 1;  
  END LOOP;  

END; $$ 

LANGUAGE plpgsql;

**************************************************************************************************************
-- select * from winedetective.get_smart('Tempernillo'); for example
drop function winedetective.get_smart;
CREATE OR REPLACE FUNCTION winedetective.get_smart (p_varietal text) 
 RETURNS TABLE (
  vintage INT,
  varietal text,
  producer text,
  vineyard text,
  bins text
) AS $$
DECLARE 
    var_r record;
BEGIN
 FOR var_r IN (
  SELECT distinct
    bottle.vintage,
    bottle.varietal, 
    bottle.producer,
    bottle.vineyard,
    winedetective.get_bins(concat(category,bottle.varietal,bottle.vintage,bottle.producer,bottle.vineyard)) as bins
    FROM 
    winedetective.bottle
  WHERE
    bottle.varietal = p_varietal
  )  
 LOOP
    vintage := var_r.vintage;
    varietal := var_r.varietal ; 
    producer := var_r.producer ; 
    vineyard := var_r.vineyard ; 
    bins:= var_r.bins;
        RETURN NEXT;
 END LOOP;
END; $$ 
LANGUAGE 'plpgsql';

**************************************************************************************************************

drop function winedetective.get_bins ;

CREATE OR REPLACE FUNCTION winedetective.get_bins(searchpattern text)
  RETURNS text AS $$

-- searchpattern is 'red, 'white', 'other'
-- returns something like this : {"red":[{"name":"Cabernet"},{"name":"Pinot Noir"},{"name":"Tempernillo"}]}

DECLARE 
  counter       INTEGER := 0 ; 
  json          TEXT DEFAULT '';
  stanza        TEXT DEFAULT '';
  recordbottle  RECORD;
  cursorbottles CURSOR for select bin from winedetective.bottle where concat(category,varietal,vintage,producer,vineyard) = searchpattern ;

  BEGIN
    -- Open the cursor
    OPEN cursorbottles;

    json = '{"' || 'bins' || '":[';

    LOOP
      -- fetch row into the film
      FETCH cursorbottles INTO recordbottle;
      -- exit when no more row to fetch
      EXIT WHEN NOT FOUND;

      -- build the output
      if (counter = 0) then
        stanza := stanza ||  '{' || '"name":"' ||  recordbottle.bin || '"}';
      else
        stanza := stanza || ',{' || '"name":"' ||  recordbottle.bin || '"}';
      end if;

      counter := counter + 1 ; 

    END LOOP;

    json := json || stanza || ']}';
    
    -- Close the cursor
    CLOSE cursorbottles;

RETURN json;
END; $$

LANGUAGE plpgsql;
