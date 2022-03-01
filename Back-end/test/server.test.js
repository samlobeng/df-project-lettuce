const {MongoClient} = require('mongodb');

//// Unit test to check DB connection, data insertion and data retrieval
describe('insert',()=>{
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect("mongodb+srv://root:root@cluster0.jeoxy.mongodb.net/farmBot?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = await connection.db("farmBot");
    });

    afterAll(async () => {
        await connection.close();
        // await db.close();
    });

    it('should aggregate docs from collection', async () => {
        const files = db.collection('seedings');

        const testData = {
            top_left: [0,0],
            bottom_right: [0,0],
            density: 0,
            depth: 0
        }
        await files.insertOne(testData)
            .then(res => {
                id = res.insertedId;
            }).catch(err =>{throw err}
        );



        const insertedData = await files.findOne({_id: id});
        expect(insertedData).toEqual(testData);

    })

});

////////////////////////////////////////////////////////////////////////






