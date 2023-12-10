import PropTypes from "prop-types";

const Comments = (props) => {
  console.log(props);
  const commentInstance = props.comment;

  console.log(commentInstance);

  const emojiCodePoint = "\u{1F4DD}";
  const deleteIcon = "\u{1F5D1}";

  if (!commentInstance) return "No Comments for this post yet";

  return (
    <div className="post-container container">
      <div className="card mb-3">
        <div className="card-body text-left">
          <div className="card-text row">
            <div className="col-2">{commentInstance.author.userName}</div>
            <div className="col-2">
              {emojiCodePoint} {deleteIcon}
            </div>
          </div>
          <div className="card-text">
            <div className="col-8">{commentInstance.text}</div>
          </div>
          <div className="card-text row">
            <div className="col-1">
              {"\u{1F44F}"}
              {commentInstance?.reactions.length}
            </div>
          </div>
          <p className="card-text">
            <small className="text-muted">
              Created on: {commentInstance.createdAt}
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

Comments.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string,
    author: PropTypes.any,
    text: PropTypes.string,
    reactions: PropTypes.array,
    createdAt: PropTypes.any,
  }),
};

export default Comments;