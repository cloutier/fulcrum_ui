import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { WalletType } from "../domain/WalletType";
import { RefinanceAssetSelectorItem } from "./RefinanceAssetSelectorItem";
import { RefinanceAssetCompoundSelectorItem } from "./RefinanceAssetCompoundSelectorItem";

export interface IRefinanceAssetSelectorProps {
  walletType: WalletType

  onSelectAsset?: (asset: Asset) => void;
}

export class RefinanceAssetSelector extends Component<IRefinanceAssetSelectorProps> {

  // true includes ENS support
  private readonly assetsShown: Map<Asset, boolean> = new Map<Asset, boolean>([
    [
      Asset.DAI,
      true
    ],
    // [
    //   Asset.DAI,
    //   false
    // ],
    // [
    //   Asset.USDC,
    //   true
    // ],
    // /*[
    //   Asset.SUSD,
    //   false
    // ],*/
    // [
    //   Asset.ETH,
    //   false
    // ],
    // [
    //   Asset.WBTC,
    //   false
    // ],
    // [
    //   Asset.LINK,
    //   false
    // ],
    // [
    //   Asset.ZRX,
    //   false
    // ],
    // [
    //   Asset.REP,
    //   false
    // ],
    // [
    //   Asset.KNC,
    //   false
    // ],
  ]);


  public render() {

    let assetList = Array.from(this.assetsShown.keys());
    let items;
    if (this.props.walletType === WalletType.Web3) {
      items = assetList.map(e => {
        return (

          <RefinanceAssetSelectorItem key={e} asset={e} onSelectAsset={this.props.onSelectAsset} />
        );
      });
    } else {
      assetList = assetList.sort(e => this.assetsShown.get(e) ? -1 : 1);
      items = assetList.map(e => {
        return (
          <RefinanceAssetSelectorItem key={e} asset={e} onSelectAsset={this.assetsShown.get(e) ? this.props.onSelectAsset : undefined} />
        );
      });
    }

    return <div className="refinance-asset-selector">{items}</div>;
  }
}
