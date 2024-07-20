import express from "express"
const app = express();


app.post('/login', async (req,res) => {
    const details = await req.body();
    try {
        
    } catch (error) {
        console.log(error)
    }
})


app.listen(6969, () => {
    console.log("server started")
})