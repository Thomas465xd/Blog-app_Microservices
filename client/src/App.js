import PostCreate from "./PostCreate"; 

const App = () => {
    return (
        <div className="container mt-5">
            <h1>Create a New Post</h1>

            <PostCreate />
            <hr />
            <p>Powered by React and Node.js</p>
        </div>
    )
};

export default App;
