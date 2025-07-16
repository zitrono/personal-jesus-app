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

export default function Page() {
  const lightConfigId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID;
  const darkConfigId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID_DARK;
  
  return (
    <div className={"flex-1 flex flex-col min-h-0"}>
      <Chat lightConfigId={lightConfigId} darkConfigId={darkConfigId} />
      <PwaInstallPrompt />
    </div>
  );
}
