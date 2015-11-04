import React from 'react';
import Relay from 'react-relay';
import _ from 'lodash';
import Draft from './Draft';

class DraftList extends React.Component {
  render() {
    return (
      <div>
        {_.map(this.props.viewer.drafts.edges, (edge) => (
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
    viewer: () => Relay.QL`
      fragment on User {
        drafts(first: 10) {
          edges {
            node {
              id,
              ${Draft.getFragment('draft')}
            },
          },
        },
      }
    `,
  },
});
