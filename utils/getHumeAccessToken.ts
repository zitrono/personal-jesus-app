import 'server-only';

import { fetchAccessToken } from "hume";

export const getHumeAccessToken = async () => {
  const apiKey = process.env.HUME_API_KEY?.trim();
  const secretKey = process.env.HUME_SECRET_KEY?.trim();

  console.log('Reference env check:', {
    apiKeyExists: !!apiKey,
    secretKeyExists: !!secretKey,
    apiKeyLength: apiKey?.length,
    secretKeyLength: secretKey?.length
  });

  if (!apiKey || !secretKey) {
    throw new Error('The sacred keys seem to be missing from heaven\'s vault. Check your divine credentials.');
  }

  const accessToken = await fetchAccessToken({
    apiKey: apiKey,
    secretKey: secretKey,
  });

  console.log('Reference token result:', { 
    tokenReceived: !!accessToken, 
    tokenType: typeof accessToken,
    tokenLength: accessToken?.length 
  });

  if (accessToken === "undefined") {
    throw new Error('The heavenly gates are having trouble with your credentials. Let\'s try again.');
  }

  return accessToken ?? null;
};
