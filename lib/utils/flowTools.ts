import { Framework, SuperToken } from '@superfluid-finance/sdk-core';
import { ethers, providers } from 'ethers';

export async function deleteFlow(_sender: string, _receiver: string, supertoken: string, signer: ethers.Signer, chainId: number, ethersProvider: providers.Provider) {
  if (!signer) {
    throw new Error('Signer is required');
  }

  const sf = await Framework.create({
    chainId: chainId,
    provider: ethersProvider,
  });

    //load the token you'd like to use. Note that tokens may be loaded by symbol or by address
    const superToken = await sf.loadSuperToken(supertoken);

    let flowOp = superToken.deleteFlow({
      sender: _sender,
      receiver: _receiver,
    });

    return await flowOp.exec(signer); // should have same address as sender
}

export async function getFlowRate(_sender: string, _receiver: string, _supertoken: string, chainId: number, ethersProvider: providers.Provider) {
  let flowInfo;
  let superToken;
  ethersProvider = new ethers.providers.StaticJsonRpcProvider(process.env.RPCPROVIDER_URL, 'goerli')
  try {
    // console.debug("Before Superfluid Framework. RPC: ", ethersProvider)
    const sf = await Framework.create({
      chainId: chainId,
      provider: ethersProvider,
    });
    // console.debug("After Superfluid Framework")
    if (
      !(ethersProvider instanceof ethers.providers.StaticJsonRpcProvider) &&
      !(ethersProvider instanceof ethers.providers.AlchemyProvider) &&
      !(ethersProvider instanceof ethers.providers.InfuraProvider)
    ) {
        // provider is not an instance of JsonRpcProvider, AlchemyProvider, or InfuraProvider
        console.debug(`Provider instance name: ${ethersProvider.constructor.name}`);
        superToken = await sf.loadSuperToken(_supertoken);
    } else {
        // provider is an instance of either JsonRpcProvider, AlchemyProvider, or InfuraProvider
        console.debug(`Provider instance name: ${ethersProvider.constructor.name}`);
        superToken = await SuperToken.create({
          address: _supertoken,
          config: sf.settings.config,
          provider: sf.settings.provider,
          chainId: sf.settings.chainId,
          networkName: sf.settings.networkName,
      });
    }
  
    flowInfo = await superToken.getFlow({ 
      sender: _sender, 
      receiver: _receiver as `0x${string}`,
      providerOrSigner: ethersProvider,
    });
  } catch (error) {
    console.error('Error getting flow info', error);
    return;
  }

  if (!flowInfo || !flowInfo.flowRate) {
    console.error('Flow info or flow rate is not available');
    return;
  }

  return getPerMonthFlowRate(flowInfo.flowRate);
}

export async function getFlowRateBk(_sender: string, _receiver: string, _supertoken: string, chainId: number, ethersProvider: providers.Provider) {
  // const ethersProvider = getProvider()
  const sf = await Framework.create({
        chainId: chainId,
        provider: ethersProvider,
      });

  if(!sf) return
  const supertoken = await sf.loadSuperToken(_supertoken)
  // console.debug('await supertoken.getFlow')
  let flowInfo = await supertoken.getFlow({ 
      sender: _sender, 
      receiver: _receiver as `0x${string}`,
      providerOrSigner: ethersProvider,
  });
  // console.debug('flowInfo: ', flowInfo)
  return getPerMonthFlowRate(flowInfo.flowRate)
}

export const getPerSecondFlowRate = (monthlyAmount: string) => {
  const weiBigNumber = ethers.utils.parseEther(`${monthlyAmount}`)
  const wei = weiBigNumber.toString()
  const amount = +wei / ((365/12) * 24 * 60 * 60)
  return `${amount.toFixed(0)}`
}

export const getPerMonthFlowRate = (flowPerSecond: string) => {
  try {
    const monthlyAmountWei = +flowPerSecond * ((365/12) * 24 * 60 * 60) // ((365/12) * 24 * 60 * 60)
    const monthlyAmount = ethers.utils.formatEther(`${monthlyAmountWei}`)
    return monthlyAmount
  } catch (error) {
    console.error('Error getting flow rate.', error)
  }
}

export const getWeiAmount = (amount: string) => {
  const weiBigNumber = ethers.utils.parseEther(amount)
  return weiBigNumber.toString()
}
