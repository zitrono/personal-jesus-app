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
    throw new Error('The sacred keys seem to be missing from heaven\'s vault. Check your divine credentials.');
  }

  try {
    // Try the SDK first
    const accessToken = await fetchAccessToken({
      apiKey: String(process.env.HUME_API_KEY),
      secretKey: String(process.env.HUME_SECRET_KEY),
    });

    console.log('Reference token result:', { 
      tokenReceived: !!accessToken, 
      tokenType: typeof accessToken,
      tokenLength: accessToken?.length 
    });

    if (accessToken && accessToken !== "undefined") {
      return accessToken;
    }
  } catch (sdkError) {
    console.log('SDK fetchAccessToken failed, trying direct API:', sdkError);
  }

  // Fallback to direct API call if SDK fails
  try {
    const response = await fetch('https://api.hume.ai/oauth2-cc/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: apiKey!,
        client_secret: secretKey!,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token fetch failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('Direct API token result:', { 
      tokenReceived: !!data.access_token, 
      tokenType: typeof data.access_token,
      tokenLength: data.access_token?.length 
    });

    return data.access_token;
  } catch (error) {
    console.error('Direct API token fetch failed:', error);
    throw new Error('The heavenly gates are having trouble with your credentials. Let\'s try again.');
  }
};
