let BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential, BlobSASPermissions;
try {
  const azure = require("@azure/storage-blob");
  BlobServiceClient = azure.BlobServiceClient;
  generateBlobSASQueryParameters = azure.generateBlobSASQueryParameters;
  StorageSharedKeyCredential = azure.StorageSharedKeyCredential;
  BlobSASPermissions = azure.BlobSASPermissions;
} catch (e) {
  console.warn("@azure/storage-blob not available");
}
require("dotenv").config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_CONTAINER_NAME;

let blobServiceClient;
let containerClient;

function initAzure() {
  if (!connectionString || connectionString.includes("yourkey")) {
    console.warn("Azure Storage not configured. Cloud features will be simulated.");
    return null;
  }
  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  containerClient = blobServiceClient.getContainerClient(containerName);
  return { blobServiceClient, containerClient };
}

function getContainerClient() {
  if (!containerClient) {
    const azure = initAzure();
    if (!azure) return null;
  }
  return containerClient;
}

async function uploadToAzure(filePath, blobName) {
  const client = getContainerClient();
  if (!client) {
    return { success: false, message: "Azure not configured" };
  }
  const blockBlobClient = client.getBlockBlobClient(blobName);
  const fs = require("fs");
  const stream = fs.createReadStream(filePath);
  await blockBlobClient.uploadStream(stream);
  return { success: true, url: blockBlobClient.url };
}

async function downloadFromAzure(blobName, downloadPath) {
  const client = getContainerClient();
  if (!client) {
    return { success: false, message: "Azure not configured" };
  }
  const blockBlobClient = client.getBlockBlobClient(blobName);
  await blockBlobClient.downloadToFile(downloadPath);
  return { success: true, path: downloadPath };
}

async function deleteFromAzure(blobName) {
  const client = getContainerClient();
  if (!client) {
    return { success: false, message: "Azure not configured" };
  }
  const blockBlobClient = client.getBlockBlobClient(blobName);
  await blockBlobClient.delete();
  return { success: true };
}

function generateSasToken(blobName) {
  const connParts = connectionString.split(";");
  const accountName = connParts.find((p) => p.startsWith("AccountName="))?.split("=")[1];
  const accountKey = connParts.find((p) => p.startsWith("AccountKey="))?.split("=")[1];
  if (!accountName || !accountKey) {
    return { success: false, message: "Azure credentials incomplete" };
  }
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  const containerName = process.env.AZURE_CONTAINER_NAME;
  const expiryHours = parseInt(process.env.AZURE_SAS_EXPIRY_HOURS) || 2;
  const startsOn = new Date();
  const expiresOn = new Date(startsOn);
  expiresOn.setHours(expiresOn.getHours() + expiryHours);
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      startsOn,
      expiresOn,
    },
    sharedKeyCredential
  ).toString();
  const url = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
  return { success: true, url };
}

module.exports = {
  initAzure,
  uploadToAzure,
  downloadFromAzure,
  deleteFromAzure,
  generateSasToken,
};
