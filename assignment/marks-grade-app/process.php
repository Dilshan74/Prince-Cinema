<?php
$submittedMarks = trim($_POST['marks'] ?? '');
$grade = null;
$message = '';
$messageType = 'error';

function calculateGrade(float $marks): string
{
    if ($marks >= 75) {
        return 'A';
    }

    if ($marks >= 65) {
        return 'B';
    }

    if ($marks >= 55) {
        return 'C';
    }

    if ($marks >= 35) {
        return 'S';
    }

    return 'F';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $message = 'Please submit your marks from the main form.';
} elseif ($submittedMarks === '') {
    $message = 'Please enter your marks.';
} elseif (!is_numeric($submittedMarks)) {
    $message = 'Marks must be a numeric value.';
} else {
    $marks = (float) $submittedMarks;

    if ($marks < 0 || $marks > 100) {
        $message = 'Marks must be between 0 and 100.';
    } else {
        $grade = calculateGrade($marks);
        $message = 'Grade calculated successfully.';
        $messageType = 'success';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grade Result</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <main class="page">
        <section class="card">
            <div class="hero">
                <p class="eyebrow">Result</p>
                <h1>Grade Processing</h1>
                <p class="intro">
                    This page is processed by PHP after the form is submitted from <code>index.php</code>.
                </p>
            </div>

            <div class="panel">
                <div class="feedback <?php echo htmlspecialchars($messageType, ENT_QUOTES, 'UTF-8'); ?>">
                    <?php echo htmlspecialchars($message, ENT_QUOTES, 'UTF-8'); ?>
                </div>

                <?php if ($grade !== null): ?>
                    <div class="result">
                        <p class="result-label">Your Result</p>
                        <div class="result-box">
                            <span class="result-marks"><?php echo htmlspecialchars($submittedMarks, ENT_QUOTES, 'UTF-8'); ?></span>
                            <span class="result-separator">Marks</span>
                            <span class="result-grade"><?php echo htmlspecialchars($grade, ENT_QUOTES, 'UTF-8'); ?></span>
                        </div>
                    </div>
                <?php endif; ?>

                <div class="actions">
                    <a class="back-link" href="index.php">Go Back</a>
                </div>
            </div>
        </section>
    </main>
</body>
</html>
