import Relay from 'react-relay';

export default {
  drafts: () => Relay.QL`query { drafts }`,
};
