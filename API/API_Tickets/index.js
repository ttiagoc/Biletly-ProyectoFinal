import TicketService from "./src/services/TicketService.js";
import express from 'express';
import cors from 'cors';

const app = express();
const port = 912;

app.use(cors())
app.use(express.json());

let svc = new TicketService();

app.get('/', async function (req, res) {
    try {
        let result = await svc.getAll();
        res.send(result)
    } catch (error) {
        res.send("error")
    }
})

app.listen(port, () => {
    console.log('Example app listening on port ' + port)
})  
