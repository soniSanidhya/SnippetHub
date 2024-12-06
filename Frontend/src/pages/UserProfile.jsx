import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import FollowList from "../components/FollowList";
import { api } from "../utils/axiosHelper.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InfinitySpin } from "react-loader-spinner";
import useAuthStore from "../store/authStore.js";

const postFollow = (userId) => api.post(`/follow/${userId}`);
// const postUnfollow = (userId) => api.post(`/follow/un/${userId}`);
const fetchUser = (username) => api.get(`/user/profile/${username}`);
const fetchFollowers = (userId) => api.get(`/follow/${userId}`);
const fetchFollowing = (userId) => api.get(`/follow/following/${userId}`);
const fetchIsFollowing = (userId) => api.get(`/follow/isFollowing/${userId}`);

export default function UserProfile() {
  const { username } = useParams();
  const { user: loggedInUser, isAuthenticated } = useAuthStore();
  const [user, setUser] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isSuccess: isProfileSuccess,
    isError: isProfileError,
    error: profileError,
  } = useQuery({
    queryKey: ["user", username],
    queryFn: () => fetchUser(username),
    staleTime: 1000 * 60 * 2,
  });

  const {
    data: followers,
    isLoading: isFollowersLoading,
    isError: isFollowersError,
    error: followersError,
  } = useQuery({
    queryKey: ["followers", userProfile?.data.data?._id],
    queryFn: () => fetchFollowers(userProfile?.data.data?._id),
    enabled: isProfileSuccess,
    staleTime: 1000 * 60 * 2,
  });
  const {
    data: following,
    isLoading: isFollowingLoading,
    isError: isFollowingError,
    error: followingError,
  } = useQuery({
    queryKey: ["following", userProfile?.data.data._id],
    queryFn: () => fetchFollowing(userProfile?.data.data._id),
    enabled: isProfileSuccess,
    staleTime: 1000 * 60 * 2,
  });

  const { data: isFollowingData } = useQuery({
    queryKey: ["isFollowing", userProfile?.data.data._id],
    queryFn: () => fetchIsFollowing(userProfile?.data.data._id),
    enabled: isProfileSuccess && isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });

  console.log("Is Following", isFollowingData);
  const queryClient = useQueryClient();
  const { mutate: followUser } = useMutation({
    mutationFn: () => postFollow(userProfile?.data?.data?._id),
    onSuccess: () => {
      // refetch the followers
      queryClient.setQueryData( ["isFollowing", userProfile?.data.data._id] , {data : {data : isFollowingData?.data?.data ? false : true}});  
      // queryClient.setQueryData( ["followers", userProfile?.data.data?._id] , {data : {data : {followerCount : isFollowingData?.data?.data ? followers?.data.data.followerCount - 1 : followers?.data.data.followerCount + 1 , followers : isFollowingData?.data?.data ? followers?.data?.data?.filter(f => f._id !== loggedInUser._id ) :  [...followers?.data.data.followers , loggedInUser]}}});
      queryClient.invalidateQueries(["followers", userProfile?.data.data?._id]);
      console.log("Followed");

    },
  });

  

  useEffect(() => {
    if (isProfileSuccess) {
      console.log(userProfile.data.data);

      setUser(userProfile.data.data);
    }
  }, [userProfile]);

  if (isProfileLoading)
    return (
      <div className="w-full h-[90vh] flex justify-center items-center">
        <div>
          <InfinitySpin
            visible={true}
            width="200"
            color="#4F46E5"
            ariaLabel="infinity-spin-loading"
          />
        </div>
      </div>
    );
  if (isProfileError) return <div>Error: {profileError.message}</div>;

  return (
    user && (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user?.avatar}
                        alt={user?.fullName || user?.username}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <div className="w-1/2 h-1/2 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user?.fullName?.charAt(0) ||
                            user?.username?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.fullName || user.username}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                      @{user.username}
                    </p>
                  </div>
                </div>

                {
                  <button
                    disabled={!isAuthenticated}
                    onClick={followUser}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    { isFollowingData?.data?.data ? "Unfollow" : "Follow" }
                  </button>
                }
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {user.bio}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-4">
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-blue-500"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      Portfolio
                    </a>
                  )}
                  {user.github && (
                    <a
                      href={`https://github.com/${user.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-blue-500"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                          clipRule="evenodd"
                        />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {user.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${user.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-blue-500"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.snippetCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Snippets
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.collectionCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Collections
                  </div>
                </div>
                <div
                  onClick={() => {
                    setShowFollowers(true);
                  }}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                >
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {followers?.data.data?.followerCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Followers
                  </div>
                </div>
                <div
                  onClick={() => {
                    setShowFollowing(true);
                  }}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                >
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {following?.data.data.followingCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Following
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Snippets
              </h2>
              {user?.snippets?.map((snippet) => (
                <div
                  key={snippet.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {snippet?.title?.length > 30 ? snippet.title.slice(0, 30) + "..." : snippet.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {snippet.description?.length > 100 ? snippet.description.slice(0, 100) + "..." : snippet.description}
                  </p>
                  <CodeEditor
                    value={snippet?.currentVersion.updatedCode}
                    language={snippet.language}
                    height="200px"
                    readOnly={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {showFollowers && (
          <FollowList
            type="followers"
            users={followers?.data.data.followers}
            onClose={() => setShowFollowers(false)}
          />
        )}

        {showFollowing && (
          <FollowList
            type="following"
            users={following.data.data.following}
            onClose={() => setShowFollowing(false)}
          />
        )}
      </div>
    )
  );
}
