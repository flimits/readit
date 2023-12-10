import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";

const Post = (props) => {
  const postInstance = props.post;

  const emojiCodePoint = "\u{1F4DD}";
  const deleteIcon = "\u{1F5D1}";

  const currentPage = useLocation().pathname;
  //Dont make title clickable, if they are already on view post page.
  const disableTitleLink = currentPage.includes("/view-post/");

  if (!postInstance?._id) return "No Post to view !!";

  return (
    <div className="post-container container">
      <div className="card mb-3">
        <div className="card-body text-left">
          <div className="card-text row">
            <div className="col-2">User</div>
            <div className="col-8 fs-5">
              {disableTitleLink ? (
                postInstance.title
              ) : (
                <Link to={`view-post/${postInstance._id}`}>
                  {postInstance.title}
                </Link>
              )}
            </div>
            <div className="col-2">
              {emojiCodePoint} {deleteIcon}
            </div>
          </div>
          <div className="card-text">
            <div className="col-8">{postInstance.postText}</div>
          </div>
          <div className="card-text row">
            <div className="col-1">
              {"\u{1F44F}"}
              {postInstance?.reactions.length}
            </div>
            <div className="col-1">
              {"\u{1F4AC}"}
              {postInstance?.comments.length}
            </div>
            <div className="col-8">Tags {postInstance?.tags.length}</div>
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

Post.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.any,
    title: PropTypes.string,
    userId: PropTypes.any,
    postText: PropTypes.string,
    reactions: PropTypes.array,
    comments: PropTypes.array,
    tags: PropTypes.array,
    createdAt: PropTypes.any,
  }),
};

export default Post;
