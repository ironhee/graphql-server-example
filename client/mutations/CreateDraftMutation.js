import Relay from 'react-relay';

export default class CreateDraftMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation {
      createDraft
    }`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DraftCreateMutationPayload {
        draftEdge
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'drafts',
      edgeName: 'draftEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }
  getVariables() {
    return {
      content: this.props.content,
    };
  }
  getOptimisticResponse() {
    return {
      draftEdge: {
        node: {
          content: this.props.content,
        },
      },
    };
  }
}