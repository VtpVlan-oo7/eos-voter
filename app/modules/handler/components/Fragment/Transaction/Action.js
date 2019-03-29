// @flow
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Icon, Label, Segment } from 'semantic-ui-react';
import ReactJson from 'react-json-view';

class PromptFragmentTransactionAction extends Component<Props> {
  render() {
    const {
      action,
      t,
    } = this.props;
    return (
      <Segment secondary>
        <Label basic size="large">
          #1
        </Label>
        <Label basic size="large">
          Contract
          <Label.Detail>{action.account}</Label.Detail>
        </Label>
        <Label basic size="large">
          Action
          <Label.Detail>{action.name}</Label.Detail>
        </Label>
        <Segment inverted>
          <ReactJson
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
            name={null}
            src={action.data}
            style={{ padding: '0.5em' }}
            theme="harmonic"
          />
        </Segment>
        {action.authorization.map((auth) => (
          <Label basic>
            <Icon name="pencil" />
            Authorization:
            <Label.Detail>
              {auth.actor}@{auth.permission}
            </Label.Detail>
          </Label>
        ))}
      </Segment>
    );
  }
}

export default translate('global')(PromptFragmentTransactionAction);