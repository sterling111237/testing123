<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Invalid email.");
    }

    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $password_hash);

    if ($stmt->execute()) {
        echo "Account created. <a href='login.php'>Login here</a>";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}
?>

<form method="post">
    Email: <input type="email" name="email" required><br>
    Password: <input type="password" name="password" required><br>
    <button type="submit">Register</button>
</form>
