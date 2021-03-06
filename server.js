const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv/config");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware lol
app.use(cors());
app.use(
	express.urlencoded({
		extended: false,
	})
);
app.use(express.json());

// Import Routes

const petsRoute = require("./routes/pets");
app.use("/petsRoute/", petsRoute);

const rescuesRoute = require("./routes/rescues");
app.use("/rescuesRoute/", rescuesRoute);

const productsRoute = require("./routes/products");
app.use("/productsRoute/", productsRoute);

const upload = require('./routes/upload');
app.use('/upload', upload);

// Serve static assets if in production lollol

//if (process.env.NODE_ENV === "production") {
// Set static folderaacd 

app.use(express.static("./frontend/build"));
app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

// DB Connection
mongoose
	.connect("mongodb+srv://Iancrix:12345@cluster0-yfli3.gcp.mongodb.net/petworld?retryWrites=true&w=majority", {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch(err => err);

// Server Init
app.listen(PORT/*, HOST*/, () => console.log(`Server started on port ${PORT}`));
