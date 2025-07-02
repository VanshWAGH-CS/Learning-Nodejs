const express = require("express");
let users = require("./MOCK_DATA.json"); // Note: we reassign if needed
const fs = require("fs");

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ==============================
// GET routes
// ==============================

app.get('/users', (req, res) => {
    const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

app.get('/api/users', (req, res) => {
    return res.json(users);
});

app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
});

// ==============================
// POST route
// ==============================

app.post('/api/users', (req, res) => {
    const { first_name, last_name, email, gender, job_title } = req.body;

    if (!first_name || !last_name || !email) {
        return res.status(400).json({ error: "Missing required user fields" });
    }

    const newUser = {
        id: users.length + 1,
        first_name,
        last_name,
        email,
        gender,
        job_title
    };

    users.push(newUser);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to write user to file" });
        }

        return res.status(201).json({ status: "User created", user: newUser });
    });
});

// ==============================
// PATCH route (Update user by ID)
// ==============================

app.patch('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    // Update the fields only if provided
    users[index] = { ...users[index], ...req.body };

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to update user" });
        }

        return res.json({ status: "User updated", user: users[index] });
    });
});

// ==============================
// DELETE route (Delete user by ID)
// ==============================

app.delete('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    const deletedUser = users.splice(index, 1)[0]; // Remove user

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to delete user" });
        }

        return res.json({ status: "User deleted", user: deletedUser });
    });
});

// ==============================
// START SERVER
// ==============================

app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
