<?php
    require('bdd.php');
    $liaison = getLink();
    $query = "SELECT formulaire.ID_Formulaire, questions.Question, reponses.Reponse, formulaire.ID_Comptes, formulaire.Date_Envoi, formulaire.Heure_Envoi, formulaire.Minute_Envoi, questions.ID_Question, reponses.ID_Reponses, typechoix.Libelle, IFNULL(Q.ID_Question, questions.ID_Question) AS primeQues
	FROM formulaire
    INNER JOIN reponses ON formulaire.ID_Formulaire = reponses.ID_Formulaire
    AND formulaire.ID_Comptes = reponses.ID_Comptes
    INNER JOIN questions ON questions.ID_Question = reponses.ID_Question
    INNER JOIN typechoix ON questions.ID_TypeChoix = typechoix.ID_TypeChoix
    LEFT JOIN etre_question_de E ON E.ID_Question = questions.ID_Question
    LEFT JOIN choix C ON E.ID_Choix = C.ID_Choix
    LEFT JOIN questions Q ON C.ID_Question = Q.ID_Question
    WHERE formulaire.ID_Comptes = ".$_SESSION['ID']."
    ORDER BY questions.Ordre";
    $exe = mysqli_query($liaison, $query);
    $lignes = [];
    while($ligne = mysqli_fetch_assoc($exe)){
        $lignes[] = $ligne;
    }
    $query = "SELECT count(DISTINCT formulaire.ID_Formulaire) AS number FROM formulaire
    INNER JOIN reponses ON formulaire.ID_Formulaire = reponses.ID_Formulaire
    WHERE formulaire.ID_Comptes = ".$_SESSION['ID'];
    $exe = mysqli_query($liaison,$query);
    $lignes[] = mysqli_fetch_assoc($exe)['number'];
    echo json_encode($lignes);
    
?>