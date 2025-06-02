<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

echo "<h1>Welcome to your dashboard!</h1>";
echo "<a href='logout.php'>Logout</a>";
?>
