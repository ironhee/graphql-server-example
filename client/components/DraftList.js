import React from 'react';
import Relay from 'react-relay';
import _ from 'lodash';
import Draft from './Draft';

class DraftList extends React.Component {
  render() {
    return (
      <div>
        {_.map(this.props.drafts.edges, (edge) => (
          <Draft
            draft={edge.node}
            key={edge.node.id}
          />
        )) }
      </div>
    );
  }
}

export default Relay.createContainer(DraftList, {
  fragments: {
    drafts: () => Relay.QL`
      fragment on DraftConnection {
        edges {
          node {
            id,
            ${Draft.getFragment('draft')}
          },
        },
      }
    `,
  },
});
