<?php
  require('bdd.php');
  $liaison = getLink();
  $query = "SELECT Q.ID_Question AS primeQues
	FROM questions
    LEFT JOIN etre_question_de E ON E.ID_Question = questions.ID_Question
    LEFT JOIN choix C ON E.ID_Choix = C.ID_Choix
    LEFT JOIN questions Q ON C.ID_Question = Q.ID_Question
    WHERE questions.ID_Question = ".$_GET['idQues']."
    LIMIT 1;";
  $exe = mysqli_query($liaison, $query);
  if($exe) {
    echo mysqli_fetch_assoc($exe)['primeQues'];
  }
  mysqli_free_result($exe);
  mysqli_close($liaison);

?>