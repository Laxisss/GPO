<?php
  require('../../user/phpscripts/bdd.php');
  $liaison = getLink();
  $query = "SELECT Q.ID_Question, Q.Question FROM `questions` AS Q
  WHERE Q.ID_Question NOT IN (SELECT ID_Question FROM etre_question_de) 
  AND Q.ID_Question <> 1
  ORDER BY Q.Ordre;";
  $exe = mysqli_query($liaison,$query);
  if($exe) {
    //Logger::setInfo('Admin fetched questions using : ' + $query);
    $questions = [];
    while($ligne = mysqli_fetch_assoc($exe)) {
      $questions[] = $ligne;
    }
    mysqli_free_result($exe);
    mysqli_close($liaison);
    echo json_encode($questions);
  }

?>