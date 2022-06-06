<?php
    require('./bdd.php');
    $liaison = getLink();
    $idChoix = $_POST['idChoix'];
    $query = "SELECT questions.ID_Question, questions.Question, typechoix.Libelle FROM questions
    INNER JOIN etre_question_de ON questions.ID_Question = etre_question_de.ID_Question
    INNER JOIN choix ON etre_question_de.ID_Choix = choix.ID_Choix
    INNER JOIN typechoix ON typechoix.ID_TypeChoix = questions.ID_TypeChoix
    WHERE choix.ID_Choix = $idChoix;";
    $exe = mysqli_query($liaison,$query);
    $lignes = [];
    while($ligne = mysqli_fetch_assoc($exe)){
        $lignes[] = $ligne;
    }

    echo json_encode($lignes);
?>