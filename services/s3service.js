
require('dotenv').config();
const AWS = require('aws-sdk');


const uploadToS3 = function (data,filename)
{
     let s3Bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET
     })  

     var params = {
        Bucket: process.env.BUCKET_NAME_EXPENSE,
        Key: filename,
        Body: data,
        ACL: 'public-read'
     }
     return new Promise((resolve, reject) => {
        s3Bucket.upload(params,(err, s3Response) => {
            if(err){
                reject(console.log("Something went wrong"));
            }
    
            else {
                console.log('SUCCESS', s3Response);
                resolve(s3Response.Location);
            }
         })
     })
     
}

module.exports = {
    uploadToS3
}