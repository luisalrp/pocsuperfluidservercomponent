"use server";

import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

export async function getFlowRateServerSide(formData: FormData) {
    "use server";

    const ethersProvider = new ethers.providers.JsonRpcProvider(process.env.RPCPROVIDER_URL, 'goerli')
    const receiverAddress = process.env.NEXT_PUBLIC_RECEIVER;
    const supertoken = process.env.NEXT_PUBLIC_SUPERTOKEN;
    const stramingChain: number = Number(process.env.NEXT_PUBLIC_STREAMINGCHAIN);
    try {
        const sender = formData.get("userId") as string;
        console.debug("sender userId: " + sender)
        if (!sender) {
            throw new Error("User ID is required");
        }
        if (!receiverAddress || !supertoken || !stramingChain || !ethersProvider) {
            console.error(receiverAddress, supertoken, stramingChain, ethersProvider)
            throw new Error("Imposible to verify streaming from serverside");
        }
        console.debug("Before Superfluid Framework")
        const sf = await Framework.create({
            chainId: stramingChain,
            provider: ethersProvider,
        });
        console.debug("After Superfluid Framework")

        const superToken = await sf.loadSuperToken(supertoken);

        let flowInfo;

        flowInfo = await superToken.getFlow({
            sender: sender,
            receiver: receiverAddress as `0x${string}`,
            providerOrSigner: ethersProvider,
        });
        return flowInfo
    } catch (error) {
        console.error('Error getting flow info', error);
        return;
    }

}
