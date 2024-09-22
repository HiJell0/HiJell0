<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];

    // Open the file in append mode
    $file = fopen("submissions.csv", "a");

    // Save the data in CSV format
    fputcsv($file, array($name, $email));

    // Close the file
    fclose($file);

    // Redirect back to the form with a success message
    echo "Submission saved successfully!";
}
?>
