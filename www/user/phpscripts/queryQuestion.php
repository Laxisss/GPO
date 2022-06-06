<?php
    require('bdd.php');
    $liaison = getLink();
    $query = "SELECT Q.ID_Question, Q.Question, C.id_Choix, T.Libelle, Q.Obligatoire FROM `questions` AS Q
    LEFT JOIN choix AS C ON C.ID_Question = Q.ID_Question
    INNER JOIN typechoix T ON Q.ID_TypeChoix = T.ID_TypeChoix
    WHERE Q.ID_Question NOT IN (SELECT ID_Question FROM etre_question_de) 
    GROUP BY Q.ID_Question ORDER BY Q.Ordre, Q.ID_Question ASC;";
    $exe = mysqli_query($liaison,$query);
    $lignes = array();
    while($ligne = mysqli_fetch_assoc($exe)){
        $lignes[] = $ligne;
    }
    $query = "SELECT IFNULL(MAX(formulaire.ID_Formulaire),0)+1 AS MaxId FROM formulaire
    WHERE ID_Comptes = ".$_SESSION['ID'].";";
    $exe = mysqli_query($liaison, $query);
    $lignes[] = mysqli_fetch_assoc($exe)['MaxId'];
    echo json_encode($lignes);
?>