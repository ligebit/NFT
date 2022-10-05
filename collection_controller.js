const fs = require('fs');

function getAllCollections() {
    return new Promise(async (resolve, reject) => {
        fs.readFile(`${__dirname}/nfts.json`, "utf8", (error, data) => {
            if(error) {
                reject(error);
            }
            resolve(JSON.parse(data));
        });
    });
}

async function deleteCollection(id) {
    let allCollections = await getAllCollections();

    for(let i = 0; i < allCollections.length; i++) {
        if(allCollections[i].id == id) {
            allCollections.splice(i, 1);
            
            return writeFile(allCollections);
        }
    }

    return false;
}

async function addCollections(collection) {
    let allCollections = await getAllCollections();

    //Уникальность id
    if(allCollections.find(el => el.id == collection.id)) return false;

    allCollections.push(collection);

    return writeFile(allCollections);
}

function writeFile(data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${__dirname}/nfts.json`, JSON.stringify(data), (error, result) => {
            if(error) reject(error);
            else resolve(true);
        });
    });
}

module.exports = {getAllCollections, deleteCollection, addCollections}