<?php
$fp = fopen('/Library/WebServer/Documents/wineDetective/debug/test.txt','a+');
fwrite($fp , 'hello world' . "\r\n");

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

else if ($data->task == 'init') {
	// rebuild tables and views based on the bottle table
	$debug = false;
	$sql  = '';
	$sql .= 'SELECT  winedetective.build_varietal();';
	$result = pg_query($conn, $sql);
}

else if ($data->task == 'getSelectedVarietal') {

	$myArray = array();

	$debug = true;
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