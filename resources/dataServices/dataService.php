<?php
// $fp = fopen('/Library/PostgreSQL/EnterpriseDB-ApachePhp/apache/www/CinCin/test.txt','a+');
$fp = fopen('/Library/WebServer/Documents/wD/debug/test.txt','a+');
fwrite($fp , 'hello world' . "\r\n");

$debug = true ;

$data = json_decode(file_get_contents("php://input"));

$dbSchema = 'wineDetective';
$dbPass   = 'Ad17934!';
$pgPort   = 5432;

$conn_string = "host=127.0.0.1 port=$pgPort dbname=postgres user=postgres password=$dbPass";
$conn = pg_connect($conn_string);


if ($data->task == 'getAllVarietals') {
  // $debug = true;
  $json = '{ "red": [{"name": "Cabernet Franc"},{"name": "Cabernet Sauvignon"}],"white": [{"name": "Chardonnay"},{"name": "Sauvignon Blanc"}],"other": [{"name": "Champagne"},{"name": "Port"},{"name": "Rose"}]}';

// echo $json;

// return;


	$sql  = '';
	$sql .= 'SELECT info FROM winedetective.orders;';
	$result = pg_query($conn, $sql);
	$rows = pg_num_rows($result);
	$json = '';

	if (!$result) {
		echo "Error: " . $sql . '<br>' ;
	} else {
        while ($row = pg_fetch_assoc($result)) {
        	$json .= $row['info'];
        }
        $json = str_replace("}{", ",", $json);
		echo $json;
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