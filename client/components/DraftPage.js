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
      new CreateDraftMutation({ content })
    );
  }

  render() {
    return (
      <div>
        <DraftInput onSave={ (content) => this.saveDraft(content) } />
        <DraftList
          ref="list"
          pool={ this.props.pool }
        />
      </div>
    );
  }
}

export default Relay.createContainer(DraftPage, {
  fragments: {
    pool: () => Relay.QL`
      fragment on Pool {
        ${DraftList.getFragment('pool')}
      }
    `,
  },
});
