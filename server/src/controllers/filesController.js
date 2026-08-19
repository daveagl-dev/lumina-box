import {
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { b2Client, BUCKET_NAME } from "../config/b2Client.js";
import { buildFileKey } from "../utils/fileKey.js";

export async function uploadFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }

  try {
    const key = buildFileKey(req.file.originalname);

    await b2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    res.status(201).json({
      key,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: "Failed to upload file to Backblaze" });
  }
}

export async function listFiles(req, res) {
  try {
    const result = await b2Client.send(
      new ListObjectsV2Command({ Bucket: BUCKET_NAME })
    );

    const files = (result.Contents || []).map((item) => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
    }));

    res.json({ files });
  } catch (error) {
    console.error("List files failed:", error);
    res.status(500).json({ error: "Failed to list files from Backblaze" });
  }
}

export async function getDownloadUrl(req, res) {
  const { key } = req.params;

  try {
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
    const url = await getSignedUrl(b2Client, command, { expiresIn: 300 });

    res.json({ url });
  } catch (error) {
    console.error("Get download URL failed:", error);
    res.status(500).json({ error: "Failed to generate download URL" });
  }
}

export async function deleteFile(req, res) {
  const { key } = req.params;

  try {
    await b2Client.send(
      new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key })
    );

    res.status(204).send();
  } catch (error) {
    console.error("Delete failed:", error);
    res.status(500).json({ error: "Failed to delete file from Backblaze" });
  }
}
