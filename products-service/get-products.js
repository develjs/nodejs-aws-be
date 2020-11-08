// eslint-disable-next-line import/prefer-default-export
// import client from './lib/db_connection.js'

import {Client} from 'pg';

const {DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD} = process.env;

const conf = {
    host: DB_HOST || 'localhost', 
    port: DB_PORT || 5432,
    database: DB_NAME,
    user: DB_USERNAME || 'postgres',
    password: DB_PASSWORD,
    ssl:{
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000
}

export const main = async (event, context) => {
    const client = new Client(conf);
    await client.connect();
    console.log('GET /products');
    
    try {
        const result = await client.query(`select products.*, stocks.count ` +
                `from products left join stocks on products.product_id = stocks.product_id;`),
            data = [...result.rows].map(item => Object.assign({}, item, {price: item.price/100}));
            
        return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(data)
        };
    } catch (e) {
        console.log(e);
        return done({error: e.message}, 500);
    } finally {
        await client.end();
    }
}
