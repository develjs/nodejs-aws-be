// eslint-disable-next-line import/prefer-default-export
import productList from "./productList.json";

export const main = async (event, context) => {
    const data = productList;
    
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(data)
    };
};
