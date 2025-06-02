<?php
$host = 'localhost'; // replace if needed
$db   = 'angel_db';
$user = 'root';
$pass = 'Yaomingers10983';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
