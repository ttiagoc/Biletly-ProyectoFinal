import TicketService from "./src/services/TicketService.js";
import express from 'express';
import cors from 'cors';

const app = express();
const port = 912;

app.use(cors())
app.use(express.json());

let svc = new TicketService();

app.get('/API/', async function (req, res) {
    try {
        let result = await svc.getEntradas();
        res.send(result)
    } catch (error) {
        res.send("error")
    }
})


app.get('/API/EventoxEntrada/:id', async function (req, res) {
    try {
        let parametros = req.params
        let result = await svc.getEventoxIdEntrada(parametros.id);
        res.send(result)
    } catch (error) {
        res.send("error")
    }
})

app.get('/API/EntradaxIdEntrada/:id', async function (req, res) {
    try {
        let parametros = req.params
        let result = await svc.getEentradaxId(parametros.id);
        res.send(result)
    } catch (error) {
        res.send("error")
    }
})


app.put('/API/UpdateEntrada/:id', async function (req, res) {
    try {

        let parametros = req.params
        let result = await svc.UpdateEntrada(parametros.id)

        res.send(result)

    } catch (error) {
        res.send("error")
    }

})

app.post('/API/InsertDatos', async function (req, res) {
    try {

        // let parametros = req.query
        // console.log(parametros)
        // let result = await svc.Insert(parametros.nombre, parametros.glutenFree, parametros.importe, parametros.descripcion)


        let parametros = req.params


        let result = await svc.InsertarDatos(parametros.adress,parametros.idNFT,parametros.idEntrada)

        res.send(result)



    } catch (error) {
        EscribirError(error)
    }

})










app.listen(port, () => {
    console.log('Example app listening on port ' + port)
})


// necesita endpoint de EVENTO x idEntrada
// getEntradaXID
// uodate entrada (para si tiene NFT O NO)
//  POST ENTRADA X NFT, usuario, entradaxusuario
//