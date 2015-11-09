import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';
import ReviseDraftMutation from '../mutations/ReviseDraftMutation';

const DRAFT = 'original';
const REVISION = 'revision';
const EDIT = 'edit';

class Draft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMode: props.draft.revision ? REVISION : DRAFT,
    };
  }

  onReviseDraft() {
    const revisionContent = this.refs.reviseContent.value;
    Relay.Store.update(
      new ReviseDraftMutation({
        id: this.props.draft.id,
        content: revisionContent,
      })
    );
  }

  changeViewMode(viewMode) {
    this.setState({
      viewMode,
    });
  }

  render() {
    const draftClassName = classNames(
      'draft-content',
      { 'hidden': this.state.viewMode !== DRAFT }
    );
    const revisonClassName = classNames(
      'revision-content',
      { 'hidden': this.state.viewMode !== REVISION }
    );
    const editClassName = classNames(
      'edit-content',
      { 'hidden': this.state.viewMode !== EDIT }
    );

    return (
      <div className="draft">
        <div>
          <span>viewMode: { this.state.viewMode } </span>
          <button
            onClick={ () => this.changeViewMode(DRAFT) }
          >
            original
          </button>
          <button
            onClick={ () => this.changeViewMode(REVISION) }
          >
            revision
          </button>
          <button
            onClick={ () => this.changeViewMode(EDIT) }
          >
            edit revision
          </button>
        </div>
        <hr/>
        <div className={draftClassName}>
          { this.props.draft.content }
        </div>
        <div className={revisonClassName}>
          { this.props.draft.revision ?
            this.props.draft.revision.content : null }
        </div>
        <div className={editClassName}>
          <textarea
            ref="reviseContent"
            cols="30"
            rows="10"
            defaultValue={ this.props.draft.revision ?
              this.props.draft.revision.content : null }
          />
          <button
            onClick={ () => this.onReviseDraft() }
          >
            submit
          </button>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Draft, {
  fragments: {
    draft: () => Relay.QL`
      fragment on Draft {
        id
        content
        createdAt
        revision {
          content
          createdAt
        }
      }
    `,
  },
});
