'use strict';

// tests for get-products
import * as getProducts from './../get-products';

const jestPlugin = require('serverless-jest-plugin');
const lambdaWrapper = jestPlugin.lambdaWrapper;
const wrapped = lambdaWrapper.wrap(getProducts, { handler: 'main' });

describe('get-products', () => {
    beforeAll(async() => {
        // lambdaWrapper.init(liveFunction); // Run the deployed lambda
    });

    it('default run', async() => {
        const event = {},
            response = await wrapped.run(event);
        expect(response).toBeDefined();
    });
});
