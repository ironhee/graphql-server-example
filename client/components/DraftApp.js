import React from 'react';
import Relay from 'react-relay';
import DraftInput from './DraftInput';
import CreateDraftMutation from '../mutations/CreateDraftMutation';

class DraftApp extends React.Component {
  saveDraft(content) {
    Relay.Store.update(
      new CreateDraftMutation({ content, viewer: this.props.viewer })
    );
  }

  render() {
    return (
      <div>
        <DraftInput onSave={ (content) => this.saveDraft(content) } />
        { this.props.children }
      </div>
    );
  }
}

export default Relay.createContainer(DraftApp, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${CreateDraftMutation.getFragment('viewer')}
      }
    `,
  },
});
