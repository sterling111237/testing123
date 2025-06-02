<?php
session_start();
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $stmt = $conn->prepare("SELECT id, password_hash FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $stmt->bind_result($id, $hash);
        $stmt->fetch();

        if (password_verify($password, $hash)) {
            $_SESSION['user_id'] = $id;
            header("Location: dashboard.php");
            exit;
        } else {
            echo "Incorrect password.";
        }
    } else {
        echo "User not found.";
    }

    $stmt->close();
}
?>

<form method="post">
    Email: <input type="email" name="email" required><br>
    Password: <input type="password" name="password" required><br>
    <button type="submit">Login</button>
</form>
