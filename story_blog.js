const { error } = require("console");
const express = require("express");
const pool = require("./db");

const story_blog = express();
const PORT = 3000;

story_blog.set("view engine", "ejs");
story_blog.use(express.static("public"));
story_blog.use(express.urlencoded({extended: true}));

const multer = require("multer");
const path = require("path");
const { buffer } = require("stream/consumers");

const storage = multer.diskStorage({
    destination:"public/uploads/",
    filename: (req, file  , cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer ({storage: storage});


const posts = [];


story_blog.get("/posts/:id/edit",(req,res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(post => post.id === id);
    if (!post) {
        return res.status(404).send("No post to edit")
    }

    res.render("edit", {post});

});

story_blog.post("/posts/:id/edit",(req,res) => {

    const id = parseInt(req.params.id);
    const post = posts.find(post => post.id === id);

    if (!post) {
        return res.status(404).send("No post to edit")
    }

    post.title = req.body.title;
    post.creator = req.body.creator;
    post.story = req.body.story;

    res.redirect("/");
});

story_blog.get("/posts/:id/delete",(req,res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(post => post.id === id);
    if (!post) {
        return res.status(404).send("No post to delete")
    }

    res.render("delete", {post});

});


story_blog.post("/posts/:id/delete",(req,res) => {
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
        return res.status(404).send("No post to delete")
    }

    posts.splice(postIndex, 1);

    res.redirect("/");
});

pool.query("SELECT NOW()")
    .then(result => {
        console.log("db connected", result.rows[0]);
    })
    .catch(error =>{
        console.error("connection failed", error.message);
    });

story_blog.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM blogs ORDER BY date_created DESC"
        );

        res.render("index", {
            posts: result.rows
        });
    }catch (error) {
        console.error("error loading db", error);
        res.status(500).send("could not load posts");
    }
});

story_blog.post("/posts", async (req, res) => {
    const { title, body, creator_user_id } = req.body;

    try {
        const userResult = await pool.query(
            "SELECT user_id, name FROM users WHERE user_id = $1",
            [creator_user_id]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).send("User not found");
        }

        const user = userResult.rows[0];

        await pool.query(
            `INSERT INTO blogs
                (creator_name, creator_user_id, title, body)
             VALUES ($1, $2, $3, $4)`,
            [user.name, user.user_id, title, body]
        );
        
        res.redirect("/");
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).send(error.message);
    }
});

story_blog.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM blogs ORDER BY date_created DESC"
        );

        res.render("index", {
            posts: result.rows
        });
    } catch (error) {
        console.error("Error loading blogs:", error);
        res.status(500).send("Could not load blog posts");
    }
});




story_blog.get("/signin", (req, res) => {
    res.render("signin", {error: null});
});

story_blog.post("/signin", async (req, res) => {
    const { user_id, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT user_id, name, password FROM users WHERE user_id = $1",
            [user_id]
        );

        if (result.rows.length === 0) {
            return res.status(401).send("Invalid user ID or password.");
        }

        const user = result.rows[0];

        if (password !== user.password) {
            return res.status(401).send("Invalid user ID or password.");
        }

        res.redirect("/");
    } catch (error) {
        console.error("Sign-in error:", error);
        res.status(500).send("Could not sign in.");
    }
});

story_blog.get("/signup", (req, res) => {
    res.render("signup", {error: null});
});

story_blog.post("/signup", async (req, res) => {
    const { user_id, name, password } = req.body;

    try {
        const existingUser = await pool.query(
            "SELECT user_id FROM users WHERE user_id = $1",
            [user_id]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).send("That user ID is already taken.");
        }

        await pool.query(
            `INSERT INTO users (user_id, name, password)
             VALUES ($1, $2, $3)`,
            [user_id, name, password]
        );

        res.redirect("/signin");
    } catch (error) {
        console.error("Sign-up error:", error);
        res.status(500).send("Could not create account.");
    }
});

story_blog.get("/", (req,res) => {
    res.render("index", {posts});
});

story_blog.get("/posts",(req,res) => {
    res.render("posts", {posts});
});

story_blog.get("/create",(req,res) => {
    res.render("create");
});

story_blog.listen(PORT, () => {
    console.log('Running link: http://localhost:${PORT}');
});

