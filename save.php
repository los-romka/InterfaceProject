<?php
    if ( isset($_POST[ 'info' ]) && isset($_POST[ 'filename' ])) {
        file_put_contents( $_POST[ 'filename' ] , $_POST[ 'info' ] );
    } 
?>