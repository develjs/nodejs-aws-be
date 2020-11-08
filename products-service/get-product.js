// eslint-disable-next-line import/prefer-default-export
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
    const id = event.pathParameters.id;
    console.log(`get /products/${id}`);

    const client = new Client(conf);
    await client.connect();
    
    try {
        const {rows} = await client.query('select products.*, stocks.count ' +
                'from products join stocks on products.product_id = stocks.product_id ' +
                `where products.product_id=$1`, [id]);

        if (!rows || !rows.length) {
            return {
                statusCode: 404,
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    error: `Product was not found (${id})`
                })
            };
        }

        const data = Object.assign({}, rows[0], {price: rows[0].price/100});

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
};
