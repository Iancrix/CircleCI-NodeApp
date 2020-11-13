const express = require("express");
const router = express.Router();

const multer = require('multer')
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });
const azureStorage = require('azure-storage');
const getStream = require('into-stream');

const azureStorageConfig = {
    accountName: "bucketimagesti",
    accountKey: "0OkmsOm50fzdP9GcrXH+3BLoylai5GjQJFHfIF8EMElLVMOt4R3apYzI2uzl+IJ2fKcUeoyFW+z0j7bpMr/+uQ==",
    blobURL: "https://bucketimagesti.blob.core.windows.net/container-images",
    containerName: "container-images"
};

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

router.get('/lol/', function (req, res) {
    blobService.listBlobsSegmented(containerName, null, function (err, result) {
        if (err) {
            //console.log("Couldn't list blobs for container %s", containerName);
            //console.error(err);
        } else {
            //console.log('Successfully listed blobs for container %s', containerName);
            //console.log(result.entries);
            //console.log(result.continuationToken);
        }
    });
});

module.exports = router;