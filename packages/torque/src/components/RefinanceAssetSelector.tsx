import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { IRefinanceCdpData } from "../domain/IRefinanceData";
import { WalletType } from "../domain/WalletType";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { RefinanceAssetSelectorItem } from "./RefinanceAssetSelectorItem";

export interface IRefinanceAssetSelectorProps {
  walletType: WalletType
}

interface IRefinanceAssetSelectorItemState {
  asset: Asset,
  isLoading: boolean;
  isItems: boolean;
  isShowRecord: boolean;
  refinanceData: IRefinanceCdpData[];
}

export class RefinanceAssetSelector extends Component<IRefinanceAssetSelectorProps, IRefinanceAssetSelectorItemState> {
  constructor(props: IRefinanceAssetSelectorProps) {
    super(props);
    this.state = {
      asset: Asset.DAI,
      isLoading: true,
      isItems: true,
      isShowRecord: false,
      refinanceData:
        [{
          cdpId: new BigNumber(0),
          urn: "",
          ilk: "",
          accountAddress: "",
          proxyAddress: "",
          isProxy: false,
          isInstaProxy: false,
        }]
    };
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
  }

  private onProviderAvailable = () => {
    // noinspection JSIgnoredPromiseFromCall
    this.derivedUpdate();
  };

  public componentDidMount(): void {
    // noinspection JSIgnoredPromiseFromCall
    this.derivedUpdate();
  }

  private derivedUpdate = async () => {
    let isItem = false;
    this.setState({ ...this.state, isLoading: true, isItems: true });

    const refinanceData = await TorqueProvider.Instance.getMakerLoans();

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < refinanceData.length; i++) {
      if (refinanceData[i].cdpId.gt(0)) {
        isItem = true;
        window.setTimeout(() => {
          this.setState({ ...this.state, isLoading: false, isItems: true, isShowRecord: true });

        }, 1900);
      }
    }
    if (!isItem && !this.state.isLoading) {
      this.setState({ ...this.state, isItems: false });
    }

    if (refinanceData[0].cdpId.gt(0)) {
      window.setTimeout(() => {
        this.setState({ ...this.state, isLoading: false });

      }, 1900);
    } else {
      window.setTimeout(() => {
        this.setState({ ...this.state, isLoading: false });
        if (!isItem && !this.state.isLoading && !this.state.isShowRecord) {
          this.setState({ ...this.state, isItems: false });
        }
      }, 12000);
    }

    this.setState({ ...this.state, refinanceData });
  };

  public render() {
    const refinance = this.state.refinanceData;
    let items;
    if (this.props.walletType === WalletType.Web3) {
      if (refinance[0].cdpId.gt(0)) {
        items = refinance.map((e, index) => {
          return (
            <RefinanceAssetSelectorItem key={refinance[index].urn} asset={Asset.DAI}
                                        cdpId={refinance[index].cdpId}
                                        urn={refinance[index].urn}
                                        accountAddress={refinance[index].accountAddress}
                                        proxyAddress={refinance[index].proxyAddress}
                                        isProxy={refinance[index].isProxy}
                                        isInstaProxy={refinance[index].isInstaProxy}
                                        ilk={refinance[index].ilk}/>
          );
        });
      }
    } else {
      if (refinance[0].cdpId !== undefined) {
        if (refinance[0].cdpId.gt(0)) {
          items = refinance.map((e, index) => {
            return (
              <RefinanceAssetSelectorItem key={refinance[index].urn} asset={Asset.DAI}
                                          cdpId={refinance[index].cdpId}
                                          urn={refinance[index].urn}
                                          accountAddress={refinance[index].accountAddress}
                                          proxyAddress={refinance[index].proxyAddress}
                                          isProxy={refinance[index].isProxy}
                                          isInstaProxy={refinance[index].isInstaProxy}
                                          ilk={refinance[index].ilk}/>
            );
          });
        }
      }
    }

    return <div className="refinance-asset-selector">
      <div className="refinance-page__main-centeredOverlay"
           style={!this.state.isLoading ? { display: `none` } : undefined}>
        <span>Loading...</span>
      </div>
      <div className="refinance-page__main-msgCentered" onClick={this.derivedUpdate}
           style={this.state.isItems ? { display: `none` } : undefined}>
        <span>Looks like you don't have any loans available to refinance.</span>
      </div>
      {items}
    </div>;
  }
}
