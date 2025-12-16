import { Request, Response } from "express";
import { SiweMessage } from "siwe";
import { nonceStore } from "./nonceStore";

export async function getNonce(req: Request, res: Response) {
  const address = req.query.address as string;
  if (!address) return res.status(400).json({ error: "Address required" });

  const nonce = crypto.randomUUID().replace(/-/g, "");
  nonceStore.set(address.toLowerCase(), nonce);
  console.log(nonceStore)

  return res.json({ nonce });
}

export async function verifySiwe(req: Request, res: Response) {
  const { message, signature } = req.body;

  if (!message || !signature) {
    return res.status(400).json({ error: "Message and signature required" });
  }

  let siweMessage: SiweMessage;

  try {
    siweMessage = new SiweMessage(message);
  } catch (err) {
    return res.status(400).json({ error: "Invalid SIWE message" });
  }

  const expectedNonce =
    nonceStore.get(siweMessage.address.toLowerCase());

  if (!expectedNonce) {
    return res.status(400).json({ error: "Nonce not found" });
  }

  try {
    const result = await siweMessage.verify({ signature });

    if (result.data.nonce !== expectedNonce) {
      return res.status(400).json({ error: "Invalid nonce" });
    }

    // Success: user authenticated
    nonceStore.delete(siweMessage.address.toLowerCase());

    return res.json({
      ok: true,
      address: siweMessage.address,
    });

  } catch (err) {
    return res.status(401).json({ error: "Invalid signature" });
  }
}
