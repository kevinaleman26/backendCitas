'use strict'

const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.saveCompletedOrder = order => {

    console.log('Guardar un pedido fue llamado');

    order.delivery_status = 'READY_FOR_DELIVERY';

    const params = {
        TableName: process.env.DYNAMOTABLE,
        Item: order
    };

    return dynamo.put(params).promise();

};

module.exports.deliverOrder = id => {

    console.log('Enviar una orden fue llamada');

    const params = {
        TableName: process.env.DYNAMOTABLE,
        Key: {
            id
        },
        ConditionsExpression: 'attribute_exists(id)',
        UpdateExpression: 'set delivery_status = :v',
        ExpressionAttributeValues: {
            ':v' : 'DELIVERED'
        },
        ReturnValues: 'ALL_NEW'
    };

    return dynamo.update(params).promise()
    .then(response => {
        console.log('order delivered');
        return response.Attributes;
    });

};

module.exports.getCita = id => {

    console.log('Conseguir ordenes fue llamada');

    const params = {
		TableName: process.env.DYNAMOTABLE,
		Key: {
			id
		}
	};

    console.log(params);


	return dynamo
		.get(params)
		.promise()
		.then(item => {
			return item.Item;
		});

};

module.exports.getAllCitas = () => {

    dynamo
    .scan({
        TableName: process.env.DYNAMOTABLE,
    })
    .promise()
    .then(data => console.log(data))
    .catch(err => console.log(err))

};
