const s3 = require('../config/aws');

class S3Driver {
    async putObject(key, buffer, mimeType) {
        await s3.putObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: mimeType
        }).promise();
    }

    getObjectStream(key) {
        return s3.getObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }).createReadStream();
    }

    async deleteObject(key) {
        await s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }).promise();
    }
}

module.exports = new S3Driver();