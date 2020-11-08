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

function done(data, status) {
    return {
        statusCode: status || 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(data)
    };
}

export const main = async (event, context) => {
    const {title, description, price, count} = JSON.parse(event.body);
    console.log('POST /products', event.body);

    const client = new Client(conf);
    await client.connect();
      
    try {
        await client.query('BEGIN')
        const res_product = await client.query('insert into products (title, description, price) ' +
            'values($1, $2, $3) RETURNING product_id; ', [title, description, Math.round(parseFloat(price)*100)]),
            product_id = res_product.rows[0].product_id,
            
            res_stocks = await client.query('INSERT INTO stocks (product_id, count) ' +
                'values($1, $2);', [product_id, parseInt(count)]);

        await client.query('COMMIT')

        if (!res_stocks || res_stocks.rowCount<1) {
            throw new Error('Something went wrong');
        }

        return done({product_id}, 201);
    } catch (e) {
        await client.query('ROLLBACK')
        return done({error: e.message}, 500);
    } finally {
        await client.end();
    }
};
