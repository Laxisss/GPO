<?php
    require('bdd.php');
    $liaison = getLink();
    $query = "SELECT count(*) AS number FROM formulaire
    INNER JOIN comptes ON formulaire.ID_Comptes = comptes.ID_Comptes
    WHERE comptes.ID_Comptes = ".$_SESSION['ID'];
    $exe = mysqli_query($liaison,$query);
    echo mysqli_fetch_assoc($exe)['number'];
?>