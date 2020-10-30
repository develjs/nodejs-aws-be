'use strict';

// tests for get-product
import * as getProduct from './../get-product';
import jestPlugin from 'serverless-jest-plugin';

const lambdaWrapper = jestPlugin.lambdaWrapper;
const wrapped = lambdaWrapper.wrap(getProduct, { handler: 'main' });

describe('get-product', () => {
    beforeAll(async () => {
        // lambdaWrapper.init(liveFunction); // Run the deployed lambda
    });

    it('default run', async () => {
        const event = {
                pathParameters: {
                    id: '1234'
                }
            },
            response = await wrapped.run(event);
    
        expect(response).toBeDefined();
    });
});
