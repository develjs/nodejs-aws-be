// eslint-disable-next-line import/prefer-default-export
import productList from "./productList.json";

export const main = async (event, context) => {
    const id = event.pathParameters.id,
        data = [...productList].find(item => item.id === id);

    if (!data) {
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

    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(data)
    };
};
