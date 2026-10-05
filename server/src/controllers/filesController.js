import {
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { b2Client, BUCKET_NAME } from "../config/b2Client.js";
import { buildFileKey } from "../utils/fileKey.js";

function userPrefix(userId) {
  return `${userId}/`;
}

export async function uploadFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }

  try {
    const key = buildFileKey(req.file.originalname);
    const fullKey = userPrefix(req.user.id) + key;

    await b2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fullKey,
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
    const prefix = userPrefix(req.user.id);
    const result = await b2Client.send(
      new ListObjectsV2Command({ Bucket: BUCKET_NAME, Prefix: prefix })
    );

    const files = (result.Contents || []).map((item) => ({
      key: item.Key.slice(prefix.length),
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
  const fullKey = userPrefix(req.user.id) + key;

  try {
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: fullKey });
    const url = await getSignedUrl(b2Client, command, { expiresIn: 300 });

    res.json({ url });
  } catch (error) {
    console.error("Get download URL failed:", error);
    res.status(500).json({ error: "Failed to generate download URL" });
  }
}

const MAX_TEXT_BYTES = 1024 * 1024;

export async function getTextContent(req, res) {
  const { key } = req.params;
  const fullKey = userPrefix(req.user.id) + key;

  try {
    const result = await b2Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fullKey,
        Range: `bytes=0-${MAX_TEXT_BYTES - 1}`,
      })
    );
    const text = await result.Body.transformToString("utf-8");
    const total = Number(result.ContentRange?.split("/")[1] ?? result.ContentLength);

    res.json({ text, truncated: total > MAX_TEXT_BYTES });
  } catch (error) {
    console.error("Get text content failed:", error);
    res.status(500).json({ error: "Failed to read file content" });
  }
}

export async function deleteFile(req, res) {
  const { key } = req.params;
  const fullKey = userPrefix(req.user.id) + key;

  try {
    await b2Client.send(
      new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: fullKey })
    );

    res.status(204).send();
  } catch (error) {
    console.error("Delete failed:", error);
    res.status(500).json({ error: "Failed to delete file from Backblaze" });
  }
}
