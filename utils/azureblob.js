const { BlobServiceClient } = require('@azure/storage-blob');

const azureBlob = {
    AZURE_STORAGE_CONNECTION_STRING: "DefaultEndpointsProtocol=https;AccountName=bucketimagesti;AccountKey=0OkmsOm50fzdP9GcrXH+3BLoylai5GjQJFHfIF8EMElLVMOt4R3apYzI2uzl+IJ2fKcUeoyFW+z0j7bpMr/+uQ==;EndpointSuffix=core.windows.net",
    download: async (containerName, fileName) => {
        // Create the BlobServiceClient object which will be used to create a container client
        const blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        // Get a reference to a container
        const containerClient = await blobServiceClient.getContainerClient(containerName);
        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        return blockBlobClient.download(0);
    },
    upload: async (containerName, fileName) => {
    },
}

module.exports = {
    azureBlob
};