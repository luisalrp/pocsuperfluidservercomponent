"use server";

import { getFlowRate } from "@/lib/utils/flowTools";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

export async function getFlowRateServerSide(formData: FormData) {
    "use server";

    // const ethersProvider = new ethers.providers.StaticJsonRpcProvider(process.env.RPCPROVIDER_URL, 'goerli')
    const ethersProvider = new ethers.providers.InfuraProvider('goerli', '3b962b4c644e4ed9bf91bd474c3f7191')
    const receiverAddress = process.env.NEXT_PUBLIC_RECEIVER;
    const supertoken = process.env.NEXT_PUBLIC_SUPERTOKEN;
    const streamingChain: number = Number(process.env.NEXT_PUBLIC_STREAMINGCHAIN);
    try {
        const sender = formData.get("userId") as string;
        console.debug("sender userId: " + sender)
        if (!sender) {
            throw new Error("User ID is required");
        }
        if (!receiverAddress || !supertoken || !streamingChain || !ethersProvider) {
            console.error(receiverAddress, supertoken, streamingChain, ethersProvider)
            throw new Error("Imposible to verify streaming from serverside");
        }
        // console.debug("Before Superfluid Framework")
        // const sf = await Framework.create({
        //     chainId: stramingChain,
        //     provider: ethersProvider,
        // });
        // console.debug("After Superfluid Framework:", sf.settings.chainId)

        // const superToken = await sf.loadSuperToken(supertoken);

        // let flowInfo;

        // flowInfo = await superToken.getFlow({
        //     sender: sender,
        //     receiver: receiverAddress as `0x${string}`,
        //     providerOrSigner: ethersProvider,
        // });
        // return flowInfo
        return getFlowRate(sender, receiverAddress, supertoken, streamingChain, ethersProvider)
    } catch (error) {
        console.error('Error getting flow info', error);
        return;
    }

}
