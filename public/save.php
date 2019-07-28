<?php

if( $_POST["quotes"] ) {
    $json_data = json_encode($$_POST["quotes"]);
    file_put_contents('quotes.json', $json_data);
    
    exit();
 }

