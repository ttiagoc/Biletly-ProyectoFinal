import sql from 'mssql';
import config from '../../dbconfig.js';

export default class TicketService {
    getEntradas = async () => {
        let resultado = null

        try {
            let pool = await sql.connect(config)
            let result = await pool.request().
                query("SELECT * FROM Evento")

            resultado = result.recordsets[0]

        } catch (error) {
            console.log(error)

        }
        return resultado;
    }


    getEventoxIdEntrada = async (id) => {
        let resultado = null

        try {
            let pool = await sql.connect(config)
            let result = await pool.request().input('pId', sql.Int, id).
                query("exec EventoxIdEntrada @pId")

            resultado = result.recordsets[0][0]

        } catch (error) {
            console.log(error)

        }
        return resultado;
    }

    getEentradaxId = async (id) => {
        let resultado = null

        try {
            let pool = await sql.connect(config)
            let result = await pool.request().input('pId', sql.Int, id).
                query("exec getEentradaxId @pId")

            resultado = result.recordsets[0][0]

        } catch (error) {
            console.log(error)

        }
        return resultado;
    }


    UpdateEntrada = async (id) => {
        let resultado = null
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .input('pId', sql.Int, id)
                .query("exec UpdateEntrada @pId")
            resultado = result.rowsAffected;

        } catch (error) {
            EscribirError(error)
        }
        return resultado
    }


    InsertarDatos = async (adress, idNFT, idEntrada) => {
        let resultado = null
        console.log("hola")
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .input('pAdress', sql.VarChar, adress ?? '')
                .input('pIdNFT', sql.Int, idNFT ?? '')
                .input('pIdEntrada', sql.Int, idEntrada ?? '')
                .query("INSERT INTO Usuario(adress) VALUES (@pAdress)").query("INSERT INTO EntradaxNFT(idEntrada,idNFT) VALUES (@pIdEntrada,@pIdNFT)")
            resultado = result.rowsAffected;

        } catch (error) {
            console.log(error)
        }
        return resultado
    }







}
