// --- 1. SETUP (The "Engine") ---
const express = require('express');
const fs = require('fs');
const app = express(); // This is the line that was missing!

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./'));

// --- 2. THE MAILBOX (The "Route") ---
app.post('/submit', (req, res) => {
    console.log("Mailbox opened! Data received:", req.body);

    const { userName, userEmail, userMessage } = req.body;
    const entry = `Name: ${userName}, Email: ${userEmail}, Message: ${userMessage}\n---\n`;

    fs.appendFile('messages.txt', entry, (err) => {
        if (err) {
            console.log("Error saving to file:", err);
            return res.status(500).send("The mailbox is full/broken.");
        }
        
        console.log("Success! Message stored in messages.txt");

        // The auto-redirect HTML you wanted:
        res.send(`
            <html>
                <head>
                    <meta http-equiv="refresh" content="3;url=/index.html">
                    <style>
                        body { display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; background: #f0f2f5; }
                        .card { padding: 30px; background: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>✅ Done!</h1>
                        <p>Thanks ${userName}, your message was saved.</p>
                        <p><small>Returning to home in 3 seconds...</small></p>
                    </div>
                </body>
            </html>
        `);
    });
});

// --- 3. THE START (The "Turn Key") ---
app.listen(3000, () => {
    console.log("Server is listening on http://localhost:3000");
});