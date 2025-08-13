import axios from "axios";
import { useState } from "react";

const CommentCreate = ({ postId }) => {

    const [content, setContent] = useState("");



    const handleSubmit = async (e) => {
        e.preventDefault(); 

        // Before setting up kubernetes, the URL was: await axios.post(`http://localhost:4001/posts/${postId}/comments`
        await axios.post(`http://posts.com/posts/${postId}/comments`, {
            content
        }).then((response) => {
            console.log("Comment created Successfully: ", response.data)
        }).catch((error) => {
            console.error("Error creating comment: ", error);
        });

        setContent(""); // Clear the content input
    }

    return (
        <div className="container mt-">
            <form
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label className="mb-2">New Comment</label>
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

export default CommentCreate;
