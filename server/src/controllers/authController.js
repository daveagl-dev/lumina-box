import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { User } from "../models/User.js";
import { b2Client, BUCKET_NAME } from "../config/b2Client.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AVATAR_URL_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days, the max for a presigned URL

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

async function toPublicUser(user) {
  let avatarUrl = null;
  if (user.avatarKey) {
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: user.avatarKey });
    avatarUrl = await getSignedUrl(b2Client, command, { expiresIn: AVATAR_URL_TTL_SECONDS });
  }
  return { id: user._id || user.id, name: user.name, email: user.email, avatarUrl };
}

export async function register(req, res) {
  const { name, email, password } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }

  if (!email || !password || !EMAIL_RE.test(email) || password.length < 8) {
    return res.status(400).json({ error: "Valid email and password (min 8 characters) are required" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name: name.trim(), email: email.toLowerCase(), passwordHash });

  const token = signToken(user);
  res.status(201).json({ token, user: await toPublicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signToken(user);
  res.json({ token, user: await toPublicUser(user) });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user: await toPublicUser(user) });
}

export async function uploadAvatar(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No image provided" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const extension = (req.file.originalname.split(".").pop() || "jpg").replace(/[^a-zA-Z0-9]/g, "");
    const newKey = `avatars/${user._id}-${randomUUID()}.${extension}`;

    await b2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: newKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const previousKey = user.avatarKey;
    user.avatarKey = newKey;
    await user.save();

    if (previousKey) {
      await b2Client
        .send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: previousKey }))
        .catch((err) => console.error("Failed to remove previous avatar:", err));
    }

    res.json({ user: await toPublicUser(user) });
  } catch (error) {
    console.error("Avatar upload failed:", error);
    res.status(500).json({ error: "Failed to upload profile picture" });
  }
}
