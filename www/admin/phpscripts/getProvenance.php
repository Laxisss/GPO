<?php
  $query = "SELECT formulaire.ID_Formulaire, formulaire.ID_Comptes, questions.Question, reponses.Reponse FROM formulaire
  INNER JOIN reponses ON reponses.ID_Formulaire = formulaire.ID_Formulaire AND reponses.ID_Comptes = formulaire.ID_Comptes
  INNER JOIN questions ON questions.ID_Question = reponses.ID_Question WHERE questions.ID_Question IN (SELECT SecQ.ID_Question FROM `questions` SecQ
  INNER JOIN etre_question_de ON SecQ.ID_Question = etre_question_de.ID_Question
  INNER JOIN choix ON etre_question_de.ID_Choix = choix.ID_Choix
  INNER JOIN questions firQ ON firQ.ID_Question = choix.ID_Question)
  AND getPrimeQuesOfQuestion(questions.ID_Question) = 1;";
  $provenance = [];
  $exe = mysqli_query($liaison, $query);
  if($exe) {
    while($ligne = mysqli_fetch_assoc($exe)) {
      $provenance[] = $ligne;
    }
    mysqli_free_result($exe);
  }
?>