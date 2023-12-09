const Post = (props) => {
  const postInstance = props.post;

  const emojiCodePoint = "\u{1F4DD}";
  const deleteIcon = "\u{26D4}";

  return (
    <div className="post-container container">
      <div className="card mb-3">
        <div className="card-body text-left">

          <div className="card-text row">
            <div className="col-2">{postInstance.userId}</div>
            <div className="col-8 fs-5">{postInstance.title}</div>
            <div className="col-2">{emojiCodePoint} {deleteIcon}</div>
          </div>
          <div className="card-text">
            <div className="col-8">{postInstance.postText}</div>
          </div>
          <div className="card-text row">
            <div className="col-1">{"\u{1F44F}"}10</div>
            <div className="col-1">{"\u{1F4AC}"}12</div>
            <div className="col-8">Tags {postInstance.tags}</div>
            <div></div>
          </div>
          <p className="card-text">
            <small className="text-muted">
              Created on: {postInstance.createdAt}
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Post;
