<?php
    require('bdd.php');
    $queryList = [];
    $liaison = getLink();
    function checkValidity($idQues, $liaison, $idForm) {
        $query = "SELECT typechoix.ID_Typechoix FROM `questions`
        INNER JOIN typechoix ON questions.ID_TypeChoix = typechoix.ID_TypeChoix
        WHERE questions.ID_Question = $idQues;";
        $exe = mysqli_query($liaison,$query);
        if (!$exe) echo "Verification failed";
        else {
            $type = mysqli_fetch_assoc($exe)["ID_Typechoix"];
            if ($type != 3) return;
            $query = "SELECT SecQ.ID_Question FROM `questions` SecQ
            INNER JOIN etre_question_de ON SecQ.ID_Question = etre_question_de.ID_Question
            INNER JOIN choix ON etre_question_de.ID_Choix = choix.ID_Choix
            INNER JOIN questions firQ ON firQ.ID_Question = choix.ID_Question
            WHERE firQ.ID_Question = $idQues;";
            $exe = mysqli_query($liaison, $query);
            if (!$exe) echo "Verification failed";
            else {
                $ids = [];
                while($ligne = mysqli_fetch_assoc($exe)){
                    $ids[] = $ligne["ID_Question"];
                }
                foreach($ids as $id) {
                    $query = "DELETE FROM `reponses` WHERE ID_Question = $id AND ID_Formulaire = $idForm";
                    $exe = mysqli_query($liaison, $query);
                    if (!$exe) echo $query;
                }
            }
        }
    }
    function checkIfPrime($idQues,$liaison){
        $query = "SELECT count(*) as number FROM `questions` AS Q
        WHERE Q.ID_Question NOT IN (SELECT ID_Question FROM etre_question_de) AND Q.ID_Question = $idQues
        GROUP BY Q.ID_Question;";
        $exe = mysqli_query($liaison,$query);
        if ($exe) {
            $count = mysqli_fetch_assoc($exe)['number'];
            if($count == 1) {
                return true;
            }
            return false;
        }
        else {
            echo "Echec de la verification";
        }
    }
    $idForm = $_POST["dataArray"][count($_POST["dataArray"])-1];
    //echo json_encode($_POST["dataArray"]);
    try{
        for($i=0; $i<count($_POST["dataArray"]); $i++){
            if(is_array($_POST["dataArray"][$i])){
                checkValidity($_POST["dataArray"][$i][2], $liaison, $idForm);
                echo $_POST["dataArray"][$i][2];
                if(checkIfPrime($_POST["dataArray"][$i][2], $liaison)) {
                    $query = "UPDATE `reponses` SET Reponse=";
                    $string = $_POST["dataArray"][$i][1];
                    if(is_numeric($string)){
                        $query .= $string." ";
                    }
                    else{
                        //$string = filter_var($string, FILTER_SANITIZE_STRING);
                        //$string = str_replace("\\","",$string);
                        $query .= '"'.$string.'" ';
                    }
                    $query .= "WHERE ID_Reponses = ".$_POST["dataArray"][$i][3]." AND `ID_Formulaire` = ".$idForm." AND ID_Comptes = ".$_SESSION['ID'].";";
                    $exe = mysqli_query($liaison,$query);
                    $queryList[] = $query;
                }
                else {
                    $query = "INSERT INTO `reponses`(`ID_Reponses`, `Reponse`, `ID_Question`, `ID_Formulaire`, `ID_Comptes`) SELECT ";
                    $query .= "(SELECT MAX(ID_Reponses)+1 FROM reponses WHERE ID_Formulaire = $idForm AND ID_Comptes = ".$_SESSION['ID']."),";
                    $query .= "'".filter_var($_POST["dataArray"][$i][1], FILTER_SANITIZE_STRING)."',".$_POST["dataArray"][$i][2].", $idForm, ".$_SESSION['ID'].";";
                    //$exe = mysqli_query($liaison,$query);
                    echo $query;
                    if(!$exe) echo $query;
                    $queryList[] = $query;
                }
            }
        }
    }
    catch(Exception $e){
        echo 'false';
        echo json_encode($queryList);
    }
    //$query = substr($query, 0, -1);
    echo 'true';
?>