const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

async function uploadToS3(data, filename, Bucket = 'appexpensetracker') {
    try {
        const s3Client = new S3Client({
            region: 'ap-south-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_ACCESS_SECRET,
            },
        });

        const command = new PutObjectCommand({
            Bucket,
            Key: filename,
            Body: data,
            ACL: 'public-read', // Make sure your bucket policy allows this
        });

        await s3Client.send(command);

        const location = `https://${Bucket}.s3.ap-south-1.amazonaws.com/${filename}`;
        return location;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    uploadToS3
};
