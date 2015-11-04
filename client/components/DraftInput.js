import React from 'react';

class DraftInput extends React.Component {
  componentDidMount() {
    this.refs.content.focus();
  }

  onSubmit() {
    const content = this.refs.content.value;
    this.props.onSave(content);
  }

  render() {
    return (
      <div>
        <textarea
          ref="content"
        />
        <button
          ref="button"
          onClick={ () => this.onSubmit() }
        >
          Submit
        </button>
      </div>
    );
  }
}

export default DraftInput;
