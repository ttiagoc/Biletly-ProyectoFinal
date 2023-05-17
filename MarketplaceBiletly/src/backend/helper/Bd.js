import React from 'react'
import axios from 'axios'

export default function Bd() {
    var resultdata;
    axios
        .get("http://localhost:912/")
        .then((result) => {
            resultdata = result.data;
           // console.log(resultdata)
           
            return (
                <>
                        {resultdata.forEach(item => {
                            
                            <>
                            {console.log(item.idEntrada)}
                            <p>Mascota: <span>{item.idEntrada}</span>
                            </p>
                            <p>Dueño: <span>{item.imagen}</span>
                            </p>
                            <p>Fecha: <span>{item.numAsiento}
                            </span>
                            </p>
                            <p>Hora: <span>{item.precio}</span>
                            </p>
                            <p>Sintomas: <span>{item.tipoEntrada}</span>
                            </p>
                            </>
                        })}

        
                </>
            )





        })
        .catch((error) => {
            console.log(error);
            return(<h1>ERORR</h1>)
        });
   
}
