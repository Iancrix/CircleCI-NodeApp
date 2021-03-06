const express = require("express");
const router = express.Router();

const multer = require('multer')
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });
const azureStorage = require('azure-storage');
const getStream = require('into-stream');

const { env_2 } = require("./ENV_2");

var azureStorageConfig = {
    accountName: "bucketimagesprod",
    accountKey: "u69LghWK/2wMJLXe4Byqnr651TLHQvxS2EOLpBZrvLz6JrgCyogD8R58YK9VD8xrzJnv3F0fZ6pneSW/54BU5g==",
    blobURL: "https://bucketimagesprod.blob.core.windows.net/containet-images-prod",
    containerName: "containet-images-prod"
};

if (env_2 !== "prod") {
    azureStorageConfig = {
        accountName: "bucketimagesdev",
        accountKey: "CnjeoKeehi8dneyHXn57yudS4zT3FAvdVTYZQCkB6GEoHILRWn8D/ZeINNHdFeowN0lUrpuy7/1RigtrvEwF0g==",
        blobURL: "https://bucketimagesdev.blob.core.windows.net/container-images-dev",
        containerName: "container-images-dev"
    };
}

console.log(process.env.NODE_ENV)
//Helloooo
const uploadFileToBlob = async (directoryPath, file) => {
    return new Promise((resolve, reject) => {
        const blobName = getBlobName(file.originalname);
        const stream = getStream(file.buffer);
        const streamLength = file.buffer.length;
        const blobService = azureStorage.createBlobService(azureStorageConfig.accountName, azureStorageConfig.accountKey);
        blobService.createBlockBlobFromStream(azureStorageConfig.containerName, `${directoryPath}/${blobName}`, stream, streamLength, err => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    filename: blobName,
                    originalname: file.originalname,
                    size: streamLength,
                    path: `${azureStorageConfig.containerName}/${directoryPath}/${blobName}`,
                    url: `${azureStorageConfig.blobURL}${azureStorageConfig.containerName}/${directoryPath}/${blobName}`
                });
            }
        });
    });
};

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}-${originalName}`;
};

const imageUpload = async (req, res, next) => {
    try {
        const image = await uploadFileToBlob('images', req.file); // images is a directory in the Azure container
        return res.json(image);
    } catch (error) {
        next(error);
    }
}

router.post('/', singleFileUpload.single('image'), imageUpload);

var blobService = azureStorage.createBlobService(azureStorageConfig.accountName, azureStorageConfig.accountKey);
var containerName = azureStorageConfig.containerName;

var blobs = [];
function aggregateBlobs(err, result, cb) {
    blobs = [];
    if (err) {
        cb(er);
    } else {
        blobs = blobs.concat(result.entries);
        if (result.continuationToken !== null) {
            blobService.listBlobsSegmented(
                containerName,
                result.continuationToken,
                aggregateBlobs);
        } else {
            cb(null, blobs);
        }
    }
}

router.get('/', function (req, res) {
    blobService.listBlobsSegmented(containerName, null, function (err, result) {
        aggregateBlobs(err, result, function (err, blobs) {
            if (err) {
                res.status(400).json({ message: err.message });
            } else {
                res.status(200).json(blobs);
            }
        });
    });
});

module.exports = router;