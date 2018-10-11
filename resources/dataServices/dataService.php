<?php
$fp = fopen('/Library/WebServer/Documents/wineDetective/debug/test.txt','a+');

$debug = true ;

$data = json_decode(file_get_contents("php://input"));

$dbSchema = 'winedetective';
$dbPass   = 'Ad17934!';
$pgPort   = 5432;

$conn_string = "host=127.0.0.1 port=$pgPort dbname=postgres user=postgres password=$dbPass";
$conn = pg_connect($conn_string);


if ($data->task == 'getAllVarietals') {
  $debug = false;
  $json = '{ "red": [{"name": "Cabernet Franc"},{"name": "Cabernet Sauvignon"}],"white": [{"name": "Chardonnay"},{"name": "Sauvignon Blanc"}],"other": [{"name": "Champagne"},{"name": "Port"},{"name": "Rose"}]}';

	$sql  = '';
	$sql .= 'SELECT varietals FROM winedetective.varietal_by_winecategory;';
	$result = pg_query($conn, $sql);
	$rows = pg_num_rows($result);
	$json = '';

	if (!$result) {
		echo "Error: " . $sql . '<br>' ;
	} else {
        while ($row = pg_fetch_assoc($result)) {
        	$json .= $row['varietals'];
        }
        $json = str_replace("}{", ",", $json);
		echo $json;
	}

}

else if ($data->task == 'addBottle') {
	// rebuild tables and views based on the bottle table
	$debug = true;

	$sqlInsertValues = array();

	$sql  = '';
	$sql .= "INSERT INTO winedetective.bottle (varietal,available,winecategory,vintage,producer,vineyard,bin,ava,price,aka)";
	$sql .= " values ";
	$sql .= '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
	pg_prepare($conn, "insertBottle", $sql);

	foreach($data->bottle->bin as $bin){

		array_push($sqlInsertValues,$data->bottle->varietal->description);
		array_push($sqlInsertValues,true);
		array_push($sqlInsertValues,$data->bottle->varietal->winecategory);
		array_push($sqlInsertValues,$data->bottle->vintage->description);
		array_push($sqlInsertValues,$data->bottle->producer);
		array_push($sqlInsertValues,$data->bottle->vineyard);
		array_push($sqlInsertValues,$bin->description);
		array_push($sqlInsertValues,$data->bottle->ava->description);
		array_push($sqlInsertValues,$data->bottle->price);
		array_push($sqlInsertValues,$data->bottle->aka);

		fwrite($fp , print_r($sqlInsertValues,1));
	
		$result = pg_execute($conn, "insertBottle", $sqlInsertValues);

    	$status = "ok";
        $errormessage = pg_result_error($result);
        
        $arr = array($status, $errormessage);

		$sqlInsertValues = [];
	}

	echo 'got it';
}

else if ($data->task == 'init') {
	// rebuild tables and views based on the bottle table
	$debug = false;
	$sql  = '';
	$sql .= 'SELECT  winedetective.build_varietal();';
	$result = pg_query($conn, $sql);
}

else if ($data->task == 'getInventory') {

	$sql = "SELECT * FROM $dbSchema.bottle order by varietal";
	$result = pg_query($conn, $sql);
	if (!$result) {
		echo "Error: " . $sql . '<br>' ;
	} else {
		while ($row = pg_fetch_assoc($result)) {
			$myArray[] = $row;
		}
		echo json_encode($myArray);
	}
}

else if ($data->task == 'getSelectedVarietal') {

	$myArray = array();

	$debug = false;
	$sql  = '';
	$sql .= "SELECT  * from winedetective.get_smart('$data->varietalName');";
	$result = pg_query($conn, $sql);
	while ($row = pg_fetch_assoc($result)) {
          $myArray[] = $row;
    }
        echo json_encode($myArray);

}

else if ($data->task == 'validate') {
	$debug = false;
	$myArray    = array();

	$sql  = "select row_to_json(t) ";
	$sql .= "from (";
	$sql .= "select * from $dbSchema.members where ";
	$sql .= "email='"      . $data->email    . "' and ";
	$sql .= "password = '" . $data->password . "'";
	$sql .= ") t";

	$result = pg_query($conn, $sql);
	$row_cnt = pg_num_rows($result);
	if ($row_cnt == 1) {
		$row = pg_fetch_row($result);
		$member = json_decode($row[0]);
		$myArray['validated'] = true;
		$myArray['member'] = $member;
		echo json_encode($myArray);
		$_SESSION["currentuser"] = $member->onlineid;
	} else {
		echo 'The email or password you have entered is invalid.';
	}
}
	// $sql  = '';
	// $sql .= 'SELECT info FROM winedetective.orders;';
	// $result = pg_query($conn, $sql);
	// $rows = pg_num_rows($result);
	// $json = '';

	// if (!$result) {
	// 	echo "Error: " . $sql . '<br>' ;
	// } else {
 //        while ($row = pg_fetch_assoc($result)) {
 //        	echo $row['info'] . '<br>';
 //        	$json .= $row['info'];
 //        }
 //        $json = str_replace("}{", ",", $json);
	// 	echo $json;
	// }

if ($debug) {
	fwrite($fp , 'task = ' . print_r($data->task,1));
	fwrite($fp , "\n");
	fwrite($fp , $sql);
	fwrite($fp , "\n");
	fwrite($fp , $json);
	fwrite($fp , "\n");



	$debug = false ;
}

?>