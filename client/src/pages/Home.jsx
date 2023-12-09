import Post from "../components/Post";

import PostModel from "../model/PostModel";

const Home = () => {

  const testPost = PostModel;

  testPost.title = "First Post Title";
  testPost.postText = "My post text is super awesome ........";
  testPost.createdAt = "December 8th ";
  testPost.userId = "User"
  

  return (
    <main className="container">
      <div className="flex-row justify-center">
        <div className="col-12 mb-3">
        <Post post={testPost}/>
        </div>
      </div>
    </main>
  );
};

export default Home;
