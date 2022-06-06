<?php
    require('bdd.php');
    $liaison = getLink();
    $idForm = $_POST["dataArray"][count($_POST["dataArray"])-1];
    $insertForm = insertForm($idForm);
    $queryList = [];
    if(count($_POST["dataArray"]) > 1) {
        $query = "INSERT INTO `reponses`(`ID_Reponses`, `Reponse`, `ID_Question`, `ID_Formulaire`, `ID_Comptes`) VALUES ";
        for($i=0; $i<count($_POST["dataArray"]); $i++){
            if(is_array($_POST["dataArray"][$i])){
                $query .= "(".($i+1).",";
                for($j=1; $j<count($_POST["dataArray"][$i]);$j++){
                    $string = $_POST["dataArray"][$i][$j];
                    if(is_numeric($string)){
                        $query .= '"'.$string.'",';
                    }
                    else{
                        $string = filter_var($string, FILTER_SANITIZE_STRING);
                        $query .= '"'.$string.'"'.",";
                    }
                }
                $query .= $idForm.",".$_SESSION['ID']."),";
            }
        }
        $query = substr($query, 0, -1);
        $queryList[] = $query;
        $exe = mysqli_query($liaison,$query);
        if($exe){
            $message = "User:[".$_SESSION['ID']."] Sent new form using : \n";
            foreach($queryList as $quer) {
                $message .= "   ".$quer."\n";
            }
            Logger::setInfo($message);
            echo 'true';
        }
        else{
            $message = "User:[".$_SESSION['ID']."] Tried to Send a new form using : \n";
            foreach($queryList as $quer) {
                $message .= "   ".$quer."\n";
            }
            Logger::setError($message);
            echo 'false';
        }
    }
    else {
        $message = "User:[".$_SESSION['ID']."] Tried to Send with data : \n";
        $message .= "   ".json_encode($_POST["dataArray"])."\n";
        Logger::setError($message);
        echo 'false';
    }

?>