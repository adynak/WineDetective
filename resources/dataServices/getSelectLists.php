<?php
	$debug = false;
	
	$fp = fopen('/Library/WebServer/Documents/wineDetective/debug/test.txt','a+');

	function exception_error_handler($errno, $errstr, $errfile, $errline ) {
		throw new ErrorException($errstr, $errno, 0, $errfile, $errline);
	}

	set_error_handler("exception_error_handler");

	$dbSchema = 'winedetective';
	$dbPass   = 'Ad17934!';
	$pgPort   = 5432;

	$conn_string = "host=127.0.0.1 port=$pgPort dbname=postgres user=postgres password=$dbPass";


	try {
		$conn = pg_connect($conn_string);
	} Catch (Exception $e) {
		echo $e->getMessage();
		die();
	}

	$tableName = ($_REQUEST['tableName']);

	$addNewDescription = ucwords("add new " . $tableName);

	$myArray = array();
	$row = array("id" => 0, "description" => $addNewDescription, "tableName" => $tableName, "label" => ucwords($tableName) );
	$myArray[] = $row;

	$sql  = '' ;
	$sql .= 'select *';
	$sql .= 'from ';
	$sql .= "$dbSchema.$tableName ";
	$sql .= 'order by ';
	$sql .= 'description; ';

	$result = pg_query($conn, $sql);

	if (!$result) {
		echo "An error occurred.\n";
		exit;
	} else {
		while ($row = pg_fetch_assoc($result)) {
			$myArray[] = $row;
    	}

	}

	$json =  json_encode($myArray) ;

	echo '{"records": ' . $json . '}';

	if ($debug) {
		fwrite($fp , $json);
		fwrite($fp , "\r\n");
	}

?>