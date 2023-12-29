"use client"

import React, { useState } from 'react';
import { useEthersProvider } from '@/lib/hooks/use-ethers-provider';
import { Framework } from '@superfluid-finance/sdk-core';
import { getFlowRateServerSide } from './getFlowRateServerSide';
import { useAccount } from 'wagmi';

const FlowRateComponent = () => {
    const [clientFlowRate, setClientFlowRate] = useState<string | null>(null);
    const [serverFlowRate, setServerFlowRate] = useState<string | null>(null);
    const ethersProvider = useEthersProvider();
    const { address: userId } = useAccount();
    const receiverAddress = process.env.NEXT_PUBLIC_RECEIVER;
    const supertoken = process.env.NEXT_PUBLIC_SUPERTOKEN;
    const stramingChain: number = Number(process.env.NEXT_PUBLIC_STREAMINGCHAIN);

    const handleClick = async () => {
        console.debug('Get Flow Rate Clicked')
        console.log(userId, receiverAddress, supertoken, stramingChain);
        if (userId && receiverAddress && supertoken && stramingChain) {
            // Fetch flow rate on client side
            const sf = await Framework.create({
                chainId: stramingChain,
                provider: ethersProvider,
            });
            console.debug("After Superfluid Framework")

            const superToken = await sf.loadSuperToken(supertoken);
            const flowInfo = await superToken.getFlow({
                sender: userId,
                receiver: receiverAddress as `0x${string}`,
                providerOrSigner: ethersProvider,
            });
            const clientFlowRate = flowInfo.flowRate
            if (clientFlowRate) {
                console.debug('Setting clientside FlowRate...');
                setClientFlowRate(clientFlowRate.toString());
            }

            // Fetch flow rate on server side
            const formData = new FormData();
            formData.append("userId", userId);
            const res = await getFlowRateServerSide(formData);
            if (res && res.flowRate) {
                console.debug('Setting serverside FlowRate...');
                setServerFlowRate(res.flowRate);
            }
        }
    };

    return (
        <div>
            <button onClick={handleClick}>Get Flow Rate</button>
            <p>Client Flow Rate: {clientFlowRate}</p>
            <p>Server Flow Rate: {serverFlowRate}</p>
        </div>
    );
};

export default FlowRateComponent;

