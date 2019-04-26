// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';
import { forEach, map, uniq } from 'lodash';
import Blockies from 'react-blockies';

import * as AccountsActions from '../../../shared/actions/accounts';
import * as AppActions from '../../../shared/actions/app';
import * as BlockExplorersActions from '../../../shared/actions/blockexplorers';
import * as ChainActions from '../../../shared/actions/chain';
import * as GlobalsActions from '../../../shared/actions/globals';
import * as NavigationActions from '../actions/navigation';
import * as SyncActions from '../../../shared/actions/sync';
import * as WalletActions from '../../../shared/actions/wallet';

import GlobalAccountDropdown from '../../../shared/containers/Global/Account/Dropdown';
import GlobalBlockchainDropdown from '../../../shared/containers/Global/Blockchain/Dropdown';
import GlobalHardwareLedgerStatus from '../../../shared/containers/Global/Hardware/Ledger/Status';
import WalletLockState from '../../../shared/components/Wallet/LockState';
import WalletMode from '../../../shared/components/Wallet/Mode';

class MenuContainer extends Component<Props> {
  componentDidMount() {
    const {
      actions,
      history,
      settings
    } = this.props;

    const {
      getBlockExplorers,
      getCurrencyStats,
      initApp
    } = actions;

    initApp();

    // switch (settings.walletMode) {
    //   case 'cold': {
    //     history.push('/coldwallet');
    //     break;
    //   }
    //   default: {
    //     if (!settings.walletInit && !settings.skipImport && !settings.walletTemp) {
    //       history.push('/');
    //     } else {
    //       // getCurrencyStats();
    //       getBlockExplorers();
    //       // forEach(settings.customTokens, (token) => {
    //       //   const [chainId, contract, symbol] = token.split(':');
    //       //   if (chainId === settings.chainId) {
    //       //     getCurrencyStats(contract, symbol.toUpperCase());
    //       //   }
    //       // });
    //     }
    //   }
    // }
    this.tick();
    this.interval = setInterval(this.tick.bind(this), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    const {
      actions,
      settings,
      validate,
    } = this.props;
    const {
      sync,
      getConstants,
      getGlobals,
      getInfo
    } = actions;
    if (settings.walletMode !== 'cold' && validate.NODE === 'SUCCESS') {
      sync();
      getConstants();
      getGlobals();
      // getInfo();
    }
  }
  render() {
    const {
      settings,
      actions,
      locked,
      validate,
      wallet,
    } = this.props;
    return (
      <Menu
        className="nav-topbar"
        attached
        style={{
          minHeight: '4.428em'
        }}
      >
        <GlobalBlockchainDropdown
          onNavigationChange={this.props.actions.changeModule}
          style={{
            // marginLeft: '107px',
            // paddingLeft: '1.5rem'
          }}
        />
        <GlobalAccountDropdown
          onNavigationChange={this.props.actions.changeModule}
          style={{
            minWidth: '250px'
          }}
        />
        <Menu.Menu position="right">
          <WalletMode
            settings={settings}
          />
          <WalletLockState
            actions={actions}
            key="lockstate"
            locked={locked}
            validate={validate}
            wallet={wallet}
          />
          <GlobalHardwareLedgerStatus />
          <Menu.Item
            as="a"
            active={module === 'settings'}
            onClick={() => this.props.actions.changeModule('settings')}
            name="settings"
            color="pink"
          >
            <Icon name="settings" />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return {
    actions: state.actions,
    locked: (!state.keys.key && state.auths.length === 0),
    navigation: state.navigation,
    prompt: state.prompt,
    settings: state.settings,
    system: state.system,
    validate: state.validate,
    wallet: state.wallet,
    wallets: state.wallets,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...AccountsActions,
      ...AppActions,
      ...BlockExplorersActions,
      ...ChainActions,
      ...GlobalsActions,
      ...NavigationActions,
      ...SyncActions,
      ...WalletActions,
    }, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MenuContainer));
