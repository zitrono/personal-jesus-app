import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";
import { Logger } from 'next-axiom';

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center"><div>Loading...</div></div>
});

export const revalidate = 0;

export default async function Page() {
  const logger = new Logger();
  
  try {
    logger.info('Page component starting');
    const accessToken = await getHumeAccessToken();

    if (!accessToken) {
      logger.error('Access token is null or undefined');
      throw new Error('Unable to get access token');
    }

    logger.info('Successfully obtained access token', { tokenLength: accessToken.length });
    
    return (
      <div className={"grow flex flex-col"}>
        <Chat accessToken={accessToken} />
      </div>
    );
  } catch (error) {
    logger.error('Error in Page component', { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined 
    });
    throw error;
  } finally {
    await logger.flush();
  }
}
