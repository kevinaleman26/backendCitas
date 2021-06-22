'use strict';

const { v4: uuidv4 } = require('uuid');
const orderManager = require('./dynamoManager')

/*
  hacerPedido
*/

module.exports.hacerPedido = (event, context, callback) => {

  const id = uuidv4();
  
  const request = JSON.parse(event.body);
  const {paciente,propietario,sintomas} = request;

  const pedido = {
    id ,
    paciente,
    propietario,
    sintomas
  }

  orderManager.saveCompletedOrder(pedido)
  .then(resp => sendResponse(200, `Se inserto correctamente: ${resp.id}`, callback))
  .catch(err => sendResponse(500, `Hubo un error al procesar el pedido. ${err}`, callback));

};


/*
  listaPedidos
*/

module.exports.listarCita = (event, context, callback) => {

  const id = event.pathParameters && event.pathParameters.id;
	if (id !== null) {
		orderManager.getCita(id)
        .then(obj => {
            sendResponse(200, `El estado de la cita: ${obj.id}`, callback);
        })
        .catch(error => {
            sendResponse(500, 'Hubo un error al procesar el pedido', callback);
        });
	} else {
		sendResponse(400, 'Falta el id', callback);
	}
}

module.exports.listarCitas = (event, context, callback) => {


    let citas = orderManager.getAllCitas()

    if(citas.length > 0){
        sendResponse(200, `tenemos Lista`, callback);
    }else {
        sendResponse(500, 'Hubo un error al procesar el pedido', callback);
    };

  }

/*
  Funciones
*/

function sendResponse(statusCode, message, callback) {
	const response = {
		statusCode: statusCode,
		body: JSON.stringify(message)
	};
	callback(null, response);
}