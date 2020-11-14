const express = require("express");
const router = express.Router();

const multer = require('multer')
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });
const azureStorage = require('azure-storage');
const getStream = require('into-stream');


const azureStorageConfig = {
    accountName: "bucketimagestiv2",
    accountKey: "lkrNZuvLzmwjfZQ7idZrdPXNzr9XhyDIkYQc8FRu9x2gGLbeQMuP4lAwJz4i4Aj87XUeeiEYpN8LKfOX8Ycobg==",
    blobURL: "https://bucketimagestiv2.blob.core.windows.net/container-images-v2",
    containerName: "container-images-v2"
};

/*
var azureStorageConfig = {
    accountName: "bucketimagestiv3",
    accountKey: "D/Z60nn4BR/QWDMmwI29AjWJ6xor62/Ey8/ODOsYnSpEB89jSHRWCG9qMHBZM4JZG/hsn1cup/gX2cEczpTyhA==",
    blobURL: "https://bucketimagestiv3.blob.core.windows.net/container-images-dev",
    containerName: "container-images-dev"
};*/


/*
const azureStorageConfig = {
    accountName: "bucketimagesti",
    accountKey: "0OkmsOm50fzdP9GcrXH+3BLoylai5GjQJFHfIF8EMElLVMOt4R3apYzI2uzl+IJ2fKcUeoyFW+z0j7bpMr/+uQ==",
    blobURL: "https://bucketimagesti.blob.core.windows.net/container-images",
    containerName: "container-images"
};

*/

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

//const { azureBlob } = require('..//utils/azureblob');

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
                //console.log("Couldn't list blobs");
                //console.error(err);
                res.status(400).json({ message: err.message });
            } else {
                //console.log(blobs);
                res.status(200).json(blobs);
            }
        });
    });
});

module.exports = router;