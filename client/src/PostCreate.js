import { useState } from "react"; 
import axios from "axios"; 

const PostCreate = () => {
    const [title, setTitle] = useState(""); 
    const [content, setContent] = useState(""); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        //console.log("Creating post with title:", title, "and content:", content); 
        await axios.post("https://posts.com/posts/create", {
            title, 
            content
        }).then((response) => {
            console.log("Post created successfully: ", response.data);
            setTitle(""); // Clear the title input
            setContent(""); // Clear the content input
        }).catch((error) => {
            console.error("Error creating post: ", error);
        });
    }

    return (
        <div className="">
            <form
                onSubmit={handleSubmit}
            >
                <div className="form-group mb-4">
                    <label>Title</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter post title!"
                    />
                </div>
                <div className="form-group">
                    <label>Content</label>
                    <textarea 
                        className="form-control"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter post content!"
                    />
                </div>
                <button className="btn btn-primary mt-4">Create Post</button>
            </form>
        </div>
    )
};

export default PostCreate;