<?php
    require('bdd.php');
    $liaison = getLink();
    $idQues = $_GET['id_ques'];
    $query ="SELECT C.ID_Choix, C.NomChoix, E.id_Question, C.id_Question AS id_PrimeQues, Q.Question  FROM `choix` AS C 
    LEFT JOIN etre_question_de E ON E.id_choix = C.id_choix
    LEFT JOIN questions Q ON E.ID_Question = Q.ID_Question
    WHERE C.ID_Question = $idQues;";
    $exe = mysqli_query($liaison,$query);
    $lignes = array();
    while($ligne = mysqli_fetch_assoc($exe)){
        $lignes[] = $ligne;
    }
    echo json_encode($lignes);
?>