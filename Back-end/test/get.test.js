const app = require('../src/services/seedingJob.js');
const conn = require('../src/server.js')

const expect = require('chai').expect;
const request = require('supertest');


describe('checking Get method', ()=>{
    beforeAll(() => {
        conn.connect()
            .then(()=> {
                console.log("connected")
            })
            .catch((err)=> { throw err});
    })


    it('OK, creating new seeding job', async ()=>{

        const res = await request(app).post('/seedingjob').send(fakeData)
        expect(res.body).to.contain.property('_id');
        // request(app).post('/seedingjob')
        // .send(fakeData)
        // .then((res) =>{
        //     const body = res.body;
        //     expect(body).to.contain.property('_id');
        //     expect(body).to.contain.property('depth');
        //     expect(body).to.contain.property('density');

        // })
    })
})
