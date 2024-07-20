import { PrismaClient } from "@prisma/client";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const app = express();
const prisma = new PrismaClient();
app.use(express.json()); // Middleware to parse JSON bodies


app.post('/login', async (req, res) => {
    const SECRET = process.env.JWT_SECRET
    try {
        const { name, password } = req.body; // Destructure the name from the request body

        const user = await prisma.user.findFirst({
            where: { name: name },
        });

        if (user) {

            const userPass = user.password;
            if (password == userPass) {
            console.log('User found:', user);

            } else {
                console.log("wrong password")
                res.send("wrong password")
            }
            const token = jwt.sign({ userId: user.id, name: user.name }, SECRET, { expiresIn: '1h' });

            // Send the token and user data as a response
            res.status(200).json({ user, token });
        } else {
            console.log('User not found');
            res.status(404).json({ error: 'User not found' }); // Send a 404 response if the user is not found
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Send a 500 response in case of server error
    }
});


app.post("/register", async (req, res) => {
  try {
    // const hashedPass = await bcrypt.hash(req.password, 10);

    const user = await prisma.user.create({
      data: {
        name: "admin",
        password: "admin",
        role: "admin",
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.listen(6969, () => {
  console.log("server started");
});
