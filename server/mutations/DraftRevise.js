import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay';
import draftEndpoint, {
  GraphQLType as GraphQLDraft,
} from '../endpoints/draft';
import revisionEndpoint from '../endpoints/revision';


const DraftReviseMutation = mutationWithClientMutationId({
  name: 'DraftRevise',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    draft: {
      type: GraphQLDraft,
    },
  },
  mutateAndGetPayload: async ({ id: draftGlobalId, content }) => {
    const { id: draftId } = fromGlobalId(draftGlobalId);
    const draft = await draftEndpoint.get(draftId);

    if (draft.revision) {
      const revision = draft.revision;
      revision.merge({ content });
      await revision.save();
    } else {
      const revision = await revisionEndpoint.create({ content });
      draft.revision = revision;
      await draft.saveAll({ revision: true });
    }

    return {
      draft,
    };
  },
});

export default DraftReviseMutation;
