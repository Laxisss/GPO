<?php
  require('bdd.php');
  $liaison = getLink();
  $query = "SELECT Q.ID_Question FROM `questions` AS Q
  WHERE Q.ID_Question NOT IN (SELECT ID_Question FROM etre_question_de) 
  GROUP BY Q.ID_Question ORDER BY Q.Ordre, Q.ID_Question ASC;";
  $exe = mysqli_query($liaison,$query);
  if($exe) {
    $lignes = [];
    while($ligne=  mysqli_fetch_assoc($exe)) {
      $lignes[] = $ligne['ID_Question'];
    }
    echo json_encode($lignes);
  }
  else {
    echo 'false';
  }
?>