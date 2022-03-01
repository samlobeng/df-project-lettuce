const app = require('../src/services/seedingJob.js');
const conn = require('../src/server.js')

const expect = require('chai').expect;
const request = require('supertest');



const fakeData = {
    top_left: [0,0],
        bottom_right: [0,0],
        density: 0,
        depth: 0
}


describe('OK', ()=>{
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
