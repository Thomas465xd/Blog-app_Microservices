import PostCreate from "./PostCreate"; 
import PostList from "./PostList"; 

const App = () => {
    return (
        <div className="container mt-5">
            <h1 className="mb-4">Create a New Post</h1>

            <PostCreate />
            <hr />

            <h2>Posts:</h2>
            <PostList />
            <hr />
            <p>Powered by React and Node.js</p>
        </div>
    )
};

export default App;
