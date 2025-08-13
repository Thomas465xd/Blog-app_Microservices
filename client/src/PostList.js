import axios from "axios"; 
import { useState, useEffect } from "react"; 
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

const PostList = () => {
    // State to hold posts
    const [posts, setPosts] = useState({});

    const fetchPosts = async () => {
        const res = await axios.get("http://posts.com/posts"); 
        //console.log(res.data)

        setPosts(res.data); 
    }

    useEffect(() => {
        // Fetch posts when the component mounts
        fetchPosts(); 
    }, []); 

    //console.log(posts); 

    const renderedPosts = Object.values(posts).map((post) => {
        return (
            <div 
                className="card mb-4" 
                style={{ width: "30%"}}
                key={post.id}
            >
                <div className=" card-body">
                    <h3 className="card-title">{post.title}</h3>
                    <p className="card-text">{post.content}</p>
                    <p className="card-text"><small className="text-muted">Author: Anonymous</small></p>

                    <hr />

                    <CommentList
                        comments={post.comments}
                    />

                    <CommentCreate
                        postId={post.id}
                    />
                </div>
            </div>
        )
    })

    return (
        <div className="d-flex flex-row flex-wrap justify-content-between mb-4">
            { renderedPosts }
        </div>
    )
};

export default PostList;