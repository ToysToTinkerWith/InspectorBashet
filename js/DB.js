
const {MongoClient} = require('mongodb');

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://abergquist96:clappersglee9610@cluster0-r8eqz.mongodb.net/test?retryWrites=true&w=majority";
 

    const client = new MongoClient(uri, { useUnifiedTopology: true });
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        await listDatabases(client);

        var post = {name: "Wyatt", age: 5};

        await createListing(client, post);

        


 
    } 
    catch (e) {
        console.error(e);
    } 
    /*finally {
        await client.close();
    }*/
}

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function createListing(client, newListing){
    const result = await client.db("UserData").collection("Commands").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
};

function getDBconnection(){
    const uri = "mongodb+srv://abergquist96:clappersglee9610@cluster0-r8eqz.mongodb.net/test?retryWrites=true&w=majority";

    const client = new MongoClient(uri, { useUnifiedTopology: true });
    return client

}
main().catch(console.error);