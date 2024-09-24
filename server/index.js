const express = require("express");
const cors = require("cors");

const app = express();

app.set("port", process.env.PORT || 5000);

app.use(express.json());
app.use(cors());
app.use(require("./Routes/routes"));

app.listen(app.get("port"), ()=>{
    console.log(`Servidor en el puerto ${app.get("port")}`)
})