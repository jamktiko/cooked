const express = require('express');
const router = express.Router();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

//AWS S3 Konfiguraatio
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

router.get('/get-upload-url', async (req, res) => {
  try {
    const fileName = `${Date.now()}-${req.query.name}`;
    const fileType = req.query.type;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `recipes/${fileName}`,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    res.json({
      uploadUrl: signedUrl,
      key: `test-uploads/${fileName}`,
      imageUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/test-uploads/${fileName}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('ei toimi jostain syystä');
  }
});

module.exports = router;
