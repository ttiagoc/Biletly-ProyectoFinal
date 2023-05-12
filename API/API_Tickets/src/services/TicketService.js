import sql from 'mssql';
import config from '../../dbconfig.js';

export default class TicketService {
    getAll = async () => {
    let resultado = null

    try {
        let pool = await sql.connect(config)
        let result = await pool.request().
            query("SELECT * FROM ENTRADA")

        resultado = result.recordsets[0]

    } catch (error) {
        console.log(error)
      
    }
    return resultado;
}

}