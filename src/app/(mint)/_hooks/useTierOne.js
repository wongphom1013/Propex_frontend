import { useAtom, useSetAtom } from "jotai";
import { useMapStore } from "../_store/maps-store";
import { mintingStepAtom, mintProgressAtom } from "../_store/mint-store";
import { RESET } from "jotai/utils";

export const useTierOne = () => {
  const [reset, previewUrl] = useMapStore((state) => [
    state.reset,
    state.previewUrl,
  ]);
  const [mintStep, setMintingStep] = useAtom(mintingStepAtom);
  const [mintProgress, setMintProgress] = useAtom(mintProgressAtom);
  function restartTierOneMinting() {
    if (mintStep === "mint-nft" && mintProgress === "mint-done") {
      URL.revokeObjectURL(previewUrl);
      reset();
      setMintingStep(RESET);
      setMintProgress(RESET);
    }
  }

  return {
    restartTierOneMinting,
  };
};
