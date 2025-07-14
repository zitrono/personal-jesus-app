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
    
    return (
      <div className={"grow flex flex-col"}>
        <Chat accessToken={accessToken} />
        <PwaInstallPrompt />
      </div>
    );
  } catch (error) {
    console.error('Error in Page component:', error);
    throw error;
  }
}
