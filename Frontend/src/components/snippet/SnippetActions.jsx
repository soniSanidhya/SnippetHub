import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { showSuccess } from "../../Utils/toast";
import { api } from "../../Utils/axiosHelper.js";
import { useMutation, useQuery } from "@tanstack/react-query";
// import api from '../../Utils/axiosHelper.js';
const fetchUpvotes = (snippetId) => api.get(`vote/upVotes/${snippetId}`);
const fetchDownvotes = (snippetId) => api.get(`vote/downVotes/${snippetId}`);
const fetchIsVoted = (snippetId) => api.get(`vote/isVoted/${snippetId}`);
const postVote = (snippetId, isUpVote) =>
  api.post(`vote/s/${snippetId}`, { isUpVote });
export default function SnippetActions({ snippet }) {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [votes, setVotes] = useState(
     0
  );

  const {
    data: upvotesData,
    isLoading: upvotesLoading,
    isError: upvotesError,
    error: upvotesErrorData,
  } = useQuery({
    queryKey: ["upvotes", snippet._id],
    queryFn: () => fetchUpvotes(snippet._id),
    staleTime: 1000 * 30 ,
  });

  const {
    data: downvotesData,
    isLoading: downvotesLoading,
    isError: downvotesError,
    error: downvotesErrorData,
  } = useQuery({
    queryKey: ["downvotes", snippet._id],
    queryFn: () => fetchDownvotes(snippet._id),
    staleTime: 1000 * 30 ,
  });

  const {
    data: isVoted,
    isLoading: isVotedLoading,
    isError: isVotedError,
    error: votedError,
  } = useQuery({
    queryKey: ["isVoted", snippet._id],
    queryFn: () => fetchIsVoted(snippet._id),
    staleTime: 1000 * 30 ,
  });

  const {mutate : voteMutation} = useMutation({
    mutationFn : (variables) => postVote(snippet._id, variables),
   
    onError : (err, variables, context) => {
      console.error(err);
      console.error(variables);
      console.error(context);
    }
  })

  useEffect(() => {
    if (upvotesData && downvotesData) {
      setVotes(upvotesData?.data?.data?.voteCount - downvotesData?.data?.data?.downVoteCount);
    }
    if (isVoted) {
      setIsUpvoted(isVoted?.data?.data?.isUpVote);
      setIsDownvoted(!isVoted?.data?.data?.isUpVote);
    }
  }, [upvotesData, downvotesData, isVoted]);

  const handleUpvote = () => {

    voteMutation(true);

    if (isUpvoted) {

      setVotes((v) => v - 1);
      setIsUpvoted(false);
    } else {
      if (isDownvoted) {
        setVotes((v) => v + 2);
        setIsDownvoted(false);
      } else {
        setVotes((v) => v + 1);
      }
      setIsUpvoted(true);
    }
  };

  const handleDownvote = () => {
    voteMutation(false);
    if (isDownvoted) {
      setVotes((v) => v + 1);
      setIsDownvoted(false);
    } else {
      if (isUpvoted) {
        setVotes((v) => v - 2);
        setIsUpvoted(false);
      } else {
        setVotes((v) => v - 1);
      }
      setIsDownvoted(true);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.currentVersion.updatedCode);
      showSuccess("Code copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleUpvote}
          className={`p-2 rounded-full transition-colors ${
            isUpvoted
              ? "text-green-500 bg-green-100 dark:bg-green-900"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </motion.button>
        <span className="text-lg font-medium">{votes}</span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDownvote}
          className={`p-2 rounded-full transition-colors ${
            isDownvoted
              ? "text-red-500 bg-red-100 dark:bg-red-900"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.button>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <span>Copy</span>
      </motion.button>
    </div>
  );
}
