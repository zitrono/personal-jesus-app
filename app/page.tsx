import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center"><div>Preparing the sacred space...</div></div>
});

const PwaInstallPrompt = dynamic(
  () => import("@/components/PwaInstallPrompt").then(mod => ({ default: mod.PwaInstallPrompt })),
  { ssr: false }
);


export const revalidate = 0;

export default async function Page() {
  try {
    const accessToken = await getHumeAccessToken();

    if (!accessToken) {
      throw new Error('The divine connection isn\'t quite ready yet. Give me a moment to prepare.');
    }
    
    const lightConfigId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID;
    const darkConfigId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID_DARK;
    
    return (
      <div className={"grow flex flex-col h-full"}>
        <Chat accessToken={accessToken} lightConfigId={lightConfigId} darkConfigId={darkConfigId} />
        <PwaInstallPrompt />
      </div>
    );
  } catch (error) {
    console.error('Error in Page component:', error);
    throw error;
  }
}
