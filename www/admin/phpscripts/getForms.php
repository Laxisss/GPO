<?php
  require('../../user/phpscripts/bdd.php');
  $liaison = getLink();
  $query = "SELECT formulaire.ID_Formulaire, formulaire.ID_Comptes, reponses.Reponse AS NomEleve, CONCAT(comptes.Nom,' ',comptes.Prenom) AS Hote, CONCAT(formulaire.Heure_Envoi,':',formulaire.Minute_Envoi) AS Heure
  FROM formulaire
  INNER JOIN comptes ON comptes.ID_Comptes = formulaire.ID_Comptes
  INNER JOIN reponses ON reponses.ID_Formulaire = formulaire.ID_Formulaire AND reponses.ID_Comptes = formulaire.ID_Comptes
  GROUP BY formulaire.ID_Formulaire, formulaire.ID_Comptes;";
  $exe = mysqli_query($liaison,$query);
  if($exe) {
    Logger::setInfo('Admin fetched existing forms using : ' . $query);
    $forms = [];
    while($ligne = mysqli_fetch_assoc($exe)) {
      $forms[] = $ligne;
    }
    mysqli_free_result($exe);
    $query = "SELECT formulaire.ID_Formulaire, formulaire.ID_Comptes, questions.Question, reponses.Reponse FROM formulaire
    INNER JOIN reponses ON reponses.ID_Formulaire = formulaire.ID_Formulaire AND reponses.ID_Comptes = formulaire.ID_Comptes
    INNER JOIN questions ON questions.ID_Question = reponses.ID_Question WHERE getPrimeQuesOfQuestion(questions.ID_Question) <> 19 AND getPrimeQuesOfQuestion(questions.ID_Question) <> 1;";
    $exe = mysqli_query($liaison, $query);
    if($exe) {
      Logger::setInfo('Admin fetched existing answers using : ' . $query);
      $reps = [];
      while($ligne = mysqli_fetch_assoc($exe)) {
        $reps[] = $ligne;
      }
      mysqli_free_result($exe);
      require('./getClasses.php');
      require('./getProvenance.php');
      $completeForms = [];
      $i = 0;
      foreach($forms as $form) {
        $completeForms[$i] = [];
        foreach($reps as $rep) {
          if($rep['ID_Formulaire'] == $form['ID_Formulaire'] && $rep['ID_Comptes'] == $form['ID_Comptes']) {
            foreach($classes as $class) {
              if($class['ID_Formulaire'] == $rep['ID_Formulaire'] && $class['ID_Comptes'] == $rep['ID_Comptes']) {
                $rep['Classe'] = $class['Reponse'];
              }
            }
            foreach($provenance as $prov) {
              if($prov['ID_Formulaire'] == $rep['ID_Formulaire'] && $prov['ID_Comptes'] == $rep['ID_Comptes']) {
                $rep['Provenance'] = $prov['Reponse'];
              }
            }
            $rep['Heure'] = $form['Heure'];
            $rep['Hote'] = $form['Hote'];
            $completeForms[$i][] = $rep;
          }
        }
        $i++;
      }
      echo json_encode($completeForms);
    }
  }

?>