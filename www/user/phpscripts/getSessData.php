<?php
    session_start();
    $lignes = array();
    foreach($_SESSION as $ligne){
        $lignes[] = $ligne;
    }
    echo json_encode($lignes);
?>