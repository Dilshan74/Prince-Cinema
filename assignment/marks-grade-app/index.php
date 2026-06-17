<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marks Grade Calculator</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <main class="page">
        <section class="card">
            <div class="hero">
                <p class="eyebrow">Activity</p>
                <h1>Marks Grade Calculator</h1>
                <p class="intro">
                    Enter your marks to see the grade based on the required ranges.
                    JavaScript checks the input before submit, and PHP processes the result in <code>process.php</code>.
                </p>
            </div>

            <div class="layout">
                <div class="panel">
                    <h2>Enter Marks</h2>
                    <form id="marksForm" method="post" action="process.php">
                        <label for="marks">Marks (0 - 100)</label>
                        <input
                            type="number"
                            id="marks"
                            name="marks"
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="Example: 78"
                        >

                        <p id="clientError" class="feedback error hidden" aria-live="polite"></p>

                        <button type="submit">Check Grade</button>
                    </form>
                </div>

                <div class="panel">
                    <h2>Grade Table</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Marks Range</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>75 - 100</td>
                                <td>A</td>
                            </tr>
                            <tr>
                                <td>65 - 74</td>
                                <td>B</td>
                            </tr>
                            <tr>
                                <td>55 - 64</td>
                                <td>C</td>
                            </tr>
                            <tr>
                                <td>35 - 54</td>
                                <td>S</td>
                            </tr>
                            <tr>
                                <td>Below 35</td>
                                <td>F</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>
