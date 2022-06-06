<?php
    require('bdd.php');
    $liaison = getLink();
    $email = $_POST['email'];
    $pswd = $_POST['pswd'];
    $query = "SELECT verifyUser('$email','$pswd') AS nombre;";
    $exe = mysqli_query($liaison, $query);
    $message = "Connection attempt with : ".$query."\n";
    if($exe){
        $ligne = mysqli_fetch_assoc($exe)['nombre'];
        $message .= "Got response : ".$ligne;
        Logger::setInfo($message);
        if($ligne == 1){
            $query = "SELECT `ID_Comptes`, `Nom`, `Prenom`, `AdresseMail`, `MotDePasse`, `isAdmin`, `isActive` 
            FROM `comptes` 
            WHERE AdresseMail = LCASE('$email') AND MotDePasse = SHA('$pswd');";
            $exe = mysqli_query($liaison,$query);
            Logger::setInfo("Account data fetched with : ".$query);
            $ligne = mysqli_fetch_assoc($exe);
            $_SESSION['ID'] = $ligne['ID_Comptes'];
            $_SESSION['Nom'] = $ligne['Nom'];
            $_SESSION['Prenom'] = $ligne['Prenom'];
            $_SESSION['AdresseMail'] = $ligne['AdresseMail'];
            $_SESSION['idAdmin'] = $ligne['isAdmin'];
            $_SESSION['isActive'] = $ligne['isActive'];
            echo 'true';
        }
    }
    else{
        $message .= "Got response : ".$exe;
        Logger::setWarn($message);
        echo "Verification failed";
    }
?>