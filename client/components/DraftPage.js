import React from 'react';
import Relay from 'react-relay';
import DraftInput from './DraftInput';
import DraftList from './DraftList';
import CreateDraftMutation from '../mutations/CreateDraftMutation';

class DraftPage extends React.Component {
  constructor(props) {
    super(props);
  }

  saveDraft(content) {
    Relay.Store.update(
      new CreateDraftMutation({ content, viewer: this.props.viewer })
    );
  }

  render() {
    return (
      <div>
        <DraftInput onSave={ (content) => this.saveDraft(content) } />
        <DraftList
          ref="list"
          viewer={ this.props.viewer }
        />
      </div>
    );
  }
}

export default Relay.createContainer(DraftPage, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${DraftList.getFragment('viewer')}
        ${CreateDraftMutation.getFragment('viewer')}
      }
    `,
  },
});
