import React from 'react';
import Relay from 'react-relay';
import Draft from './Draft';

const PAGE_SIZE = 5;

class DraftList extends React.Component {
  constructor(props) {
    super(props);
  }

  queryNextPage() {
    this.props.relay.setVariables({
      first: this.props.relay.variables.first + PAGE_SIZE,
    });
  }

  renderDrafts() {
    return this.props.viewer.drafts.edges.map(edge =>
      <Draft
        key={edge.node.id}
        draft={edge.node}
      />
    );
  }

  render() {
    return (
      <div>
        { this.renderDrafts() }
        <button onClick={ () => this.queryNextPage() } >
          Fetch More
        </button>
      </div>
    );
  }
}

export default Relay.createContainer(DraftList, {
  initialVariables: {
    first: PAGE_SIZE,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id,
        drafts(first: $first) {
          edges {
            cursor
            node {
              id
              ${Draft.getFragment('draft')}
            },
          },
        },
      }
    `,
  },
});
