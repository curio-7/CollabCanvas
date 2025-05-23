import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SignInSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client"
import bcrypt from 'bcryptjs';

const app = express();
const port = 3001;

app.use(express.json());

app.post("/signup", async(req, res) => {
    // Handle signup logic here   
    const parsedData = CreateUserSchema.safeParse(req.body); //if used parse then it will throw an error if the data is not valid so we have to use data.username and data.password
    // Validate user data
    if (!parsedData.success) {
        res.status(400).send("Invalid user data");
        return;
    }

    try{
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10); // Hashing password

        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                password: hashedPassword,
                name: parsedData.data.name,
            },
        })
        res.status(200).json({message : "User created successfully with id: " + user.id})
    }catch(e){
        res.status(411).json({message : "User already exists"})
        return
    }

    res.status(200).send("Signup successful");
});

app.post("/signin", async(req, res) => {
    // Handle login logic here
    const data = SignInSchema.safeParse(req.body);
    if (!data.success) {
        res.status(400).send("Invalid login data");
        return;
    }

    const { username, password } = data.data; 

    try{
        const user = await prismaClient.user.findUnique({
            where: {
                email: username,

            }
        });

        if(!user) {
            res.status(401).send("Invalid username or password");
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password); // Compare password with hashed password
        if (!isPasswordValid) {
            res.status(401).send("Invalid password");
            return;
        }

        const token = jwt.sign({ userId : user?.id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login Successfull with token: " + token }); 

    }catch(e){
        res.status(500).json({message : "Internal server error"})
        return
    }
});

app.post("/room", middleware, async(req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success){
        res.status(400).send("Invalid room data");
        return;
    }

    try{
        const room = await prismaClient.room.create({
            data: {
                slug : data.data.name,
                adminId : req.userId!, // using non-null assertion operator to tell TypeScript that userId is not null or undefined
            },
        });
        res.status(200).json({ message: "Room created successfully with id: " + room.id + "by admin" + req.userId });
    }catch(e){
        res.status(411).json({ message: "Room already exists." });
        return;
    }
});

app.get("/room/:slug", middleware, async(req, res) => {
    const slug = req.params.slug;
    try{
        const room = await prismaClient.room.findUnique({
            where: {
                slug: slug,
            },
        });

        if(!room){
            res.status(404).send("Room not found");
            return;
        }

        res.status(200).json({ message: "Room found with id: " + room.id });
    }catch(e){
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});

app.get("/chats/:roomId", middleware, async(req, res) => {
    const roomId = req.params.roomId;
    try{
        const chats = await prismaClient.chat.findMany({
            where: {
                roomId: Number(roomId),
            },
            take: 60,
            orderBy: {
                createdAt: "desc",
            },
        });

        if(!chats){
            res.status(404).send("No chats found");
            return;
        }

        res.status(200).json({ message: "Chats found", chats: chats });
    }catch(e){
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});

app.post("/logout", middleware, async(req, res) => {
    console.log("Received logout request");
    res.status(200).send("Logout successful");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});