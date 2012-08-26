<?php 
$obj=array();

switch (@$_GET['type']){
	case 'numbers':
		while (count($obj)<$_GET['values']){
			$obj[]=rand(1,50);
			$obj=array_unique($obj);
		}
	break;
	
	case 'letters':
		while (count($obj)<$_GET['values']){
			$obj[]=chr(rand(97,122));
			$obj=array_unique($obj);
		}
	break;
}

header('Content-type: application/json');
echo json_encode($obj);
?>