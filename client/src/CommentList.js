const CommentList = ({ comments }) => {
    // State to hold posts
    /**
    const [comments, setComments] = useState({});

    const fetchComments = async () => {
        const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`); 

        setComments(res.data); 
    }

    useEffect(() => {
        // Fetch posts when the component mounts
        fetchComments(); 
    }, []); 
     */

    //console.log(posts); 
    //console.log(comments)

    
    const renderedComments = Object.values(comments).map((comment) => {
        let content; 
    
        if(comment.status === "approved") {
            content = comment.content; 
        }
    
        if(comment.status === "pending") {
            content = "This comment is awaiting moderation 🛠️"; 
        }

        if(comment.status === "rejected") {
            content = "This comment has been rejected ❌"
        }

        return (
            <div 
                className="card mb-4" 
                key={comment.id}
            >
                <div className=" card-body">
                    <p className="card-text"><small className="text-muted">Author: Anonymous</small></p>
                    <p className="card-text text-muted">{content}</p>
                </div>
            </div>
        )
    })

    return (
        <div className="container mt-4">
            { renderedComments }
        </div>
    )
};

export default CommentList;
