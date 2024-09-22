<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    echo "POST request received successfully!";
} else {
    echo "This is not a POST request!";
}
?>
