import { useEffect, useState } from "react";
//import { useMutation } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { SINGLE_POST } from "../utils/queries";
import { EDIT_POST } from "../utils/mutations";

const EditPost = () => {
  // Get post id from params
  const { postId } = useParams();

  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  //get post details
  const { error, loading, data } = useQuery(SINGLE_POST, {
    //pass url params
    variables: { postId: postId },
  });

  // mutation to edit a post
  const [editPost] = useMutation(EDIT_POST);

  // use effects to handle updating title and text when we get results from query
  useEffect(() => {
    if (data && data.getPost) {
      setTitle(data.getPost.title);
      setPostText(data.getPost.postText);
    }
  }, [data]);

  if (error) return "Error ....";
  if (loading) return "loading ....";

  const handleTitleChange = (e) => {
    // Update state as the user edits the input
    setTitle(e.target.value);
  };
  const handlePostTextChange = (e) => {
    // Update state as the user edits the input
    setPostText(e.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log("POst fields: ", { title, postText });
      const { editedPost } = await editPost({
        variables: {
          postId: postId,
          newTitle: title,
          newText: postText,
        },
      });

      console.log("Data saved to DB: ", editedPost);
      setSubmitted(true);
    } catch (err) {
      console.log(err);
    }
    // Redirect back to the page after a 1.5 second delay
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="createpost-form">
      <div className="createpost-boxinform">
        {submitted ? (
          <div>
            <h2>Your post has been submitted</h2>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="title"
                placeholder="Title"
                value={title}
                onChange={handleTitleChange}
                name="title"
              />
            </div>
            <br></br>
            <div className="form-group">
              <textarea
                className="form-control"
                id="post-body"
                rows="3"
                placeholder="Post Message"
                value={postText}
                onChange={handlePostTextChange}
                name="postText"
              />
            </div>
            <br></br>
            {/* <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="newtag"
                placeholder="Add Tags"
                value={formState.tag}
                onChange={handleChange}
                name="tags"
              />
            </div> */}
            <div className="form-group">
              <Link to="/">
                <button type="button" className="btn btn-primary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditPost;
