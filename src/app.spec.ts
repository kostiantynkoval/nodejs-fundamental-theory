import { app } from './app';
import { sequelize } from './data-access/db';
// eslint-disable-next-line no-unused-vars
import request, { Response } from 'supertest';

describe('Test groups api', () => {
    afterAll(done => {
        // Closing the DB connection allows Jest to exit successfully.
        sequelize.close();
        done();
    });

    test('It should response the GET method', async (done) => {
        return request(app)
            .get('/api/groups')
            .then((response: Response) => {
                // @ts-ignore
                expect(response.statusCode).toBe(200);
                console.log(response);
                done();
            });
    });
});
