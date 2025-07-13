import 'server-only';

import { fetchAccessToken } from "hume";

export const getHumeAccessToken = async () => {
  const apiKey = process.env.HUME_API_KEY;
  const secretKey = process.env.HUME_SECRET_KEY;

  console.log('Reference env check:', {
    apiKeyExists: !!apiKey,
    secretKeyExists: !!secretKey,
    apiKeyLength: apiKey?.length,
    secretKeyLength: secretKey?.length
  });

  if (!apiKey || !secretKey) {
    throw new Error('Missing required environment variables (HUME_API_KEY or HUME_SECRET_KEY)');
  }

  const accessToken = await fetchAccessToken({
    apiKey: String(process.env.HUME_API_KEY),
    secretKey: String(process.env.HUME_SECRET_KEY),
  });

  console.log('Reference token result:', { 
    tokenReceived: !!accessToken, 
    tokenType: typeof accessToken,
    tokenLength: accessToken?.length 
  });

  if (accessToken === "undefined") {
    throw new Error('Unable to get access token');
  }

  return accessToken ?? null;
};
