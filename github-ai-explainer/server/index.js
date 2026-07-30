require("dotenv").config(); // 👈 Must be at the very top!
const express = require("express"); 
const app = express(); 
const cors = require("cors"); 

const repositoryRoutes = require("./routes/repositoryRoutes");

const port = 3000; 

app.use(cors()); 
app.use(express.json()); 

app.get("/", (req, res) => {
    res.send("Server is running smoothly"); 
}); 

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK", 
        timestamp: new Date().toISOString(),
    }); 
}); 

app.use("/api/repository", repositoryRoutes); 

app.use((req, res) => {
    res.status(404).json({error: "Route not found"}); 
})

app.listen(port, () => {
    console.log("Server is listing to port: 3000");
    
})

