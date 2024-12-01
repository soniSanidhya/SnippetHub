import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { showSuccess, showError } from '../../Utils/toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../Utils/axiosHelper';

const fetchComments = (snippetId) => api.get(`comment/s/${snippetId}`);
const postComment = (snippetId, content) => api.post(`comment/s/${snippetId}`, { content });

export default function SnippetComments({ snippet, isAuthenticated }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const {data : commentsData , isLoading , isError , error} = useQuery({
    queryKey : ["comments" , snippet._id],
    queryFn : ()=>fetchComments(snippet._id),
  });

  const {mutate : postCommentMutation} = useMutation({
    mutationKey : "postComment",
    mutationFn : (content)=> postComment(snippet._id, content),
    onSuccess : (data)=>{
      console.log(data);
      
      setComments([ data.data.data,...comments]);
      setNewComment('');
      showSuccess('Comment added successfully');
      // queryClient.invalidateQueries(["comments" , snippet._id]);

    }
  })

  useEffect(() => {
    if (commentsData) {
      // console.log(commentsData);
      
      setComments(commentsData.data.data.comments);
    }
  }, [commentsData]);
  // console.log(snippet);
  // console.log("comments " , comments);
  
  
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // API call would go here
      // const comment = {
      //   id: Date.now(),
      //   content: newComment,
      //   createdAt: new Date().toISOString(),
      //   author: {
      //     name: 'Current User',
      //     username: 'currentuser',
      //   },
      // };
      postCommentMutation(newComment);
      // showSuccess('Comment added successfully');
    } catch (error) {
      showError('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      // API call would go here
      setComments(comments.filter(comment => comment.id !== commentId));
      showSuccess('Comment deleted successfully');
    } catch (error) {
      showError('Failed to delete comment');
    }
  };

  // return (
  //   <div className="">
  //     Comments
  //   </div>
  // );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comments</h3>
      
      {isAuthenticated && (
        <form onSubmit={handleAddComment} className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            rows="3"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Comment
          </button>
        </form>
      )}

      <div className="space-y-4">
        {comments?.map((comment) => (
          <motion.div
            key={comment._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {comment.owner?.fullName || 'Anonymous'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    @{comment.owner?.username || 'anonymous'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{comment.content}</p>
              </div>
              {isAuthenticated && comment.author?.username === 'currentuser' && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}