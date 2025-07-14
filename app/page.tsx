import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";
import { Logger } from 'next-axiom';

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center"><div>Preparing the sacred space...</div></div>
});

export const revalidate = 0;

export default async function Page() {
  const logger = new Logger();
  
  try {
    logger.info('Page component starting');
    const accessToken = await getHumeAccessToken();

    if (!accessToken) {
      logger.error('Access token is null or undefined');
      throw new Error('The divine connection isn\'t quite ready yet. Give me a moment to prepare.');
    }

    logger.info('Successfully obtained access token', { tokenLength: accessToken.length });
    
    return (
      <div className={"h-full flex flex-col"}>
        <Chat accessToken={accessToken} />
      </div>
    );
  } catch (sin) {
    logger.error('Sin in Page component', { 
      sin: sin instanceof Error ? sin.message : String(sin),
      stack: sin instanceof Error ? sin.stack : undefined 
    });
    throw sin;
  } finally {
    await logger.flush();
  }
}
