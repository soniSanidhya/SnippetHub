import { useState, useEffect } from "react";
import Input from "../components/ui/Input";
import { api } from "../utils/axiosHelper.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAuthStore from "../store/authStore.js";
import { InfinitySpin } from "react-loader-spinner";

const patchProfile = (profile) => api.patch("user/update", profile);

const patchAvatar = (avatar) =>
  api.patch("user/update/avatar", avatar, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const getUserProfile = () => api.get("user");



export default function Profile() {
  const { user, updateUser } = useAuthStore();
  

  const [avatar, setAvatar] = useState(null);

  // console.log(user);

  const { mutate: updateAvatarMutation } = useMutation({
    mutationKey: ["updateAvatar"],
    mutationFn: (avatar) => patchAvatar(avatar),
    onSuccess: (data) => {
      updateUser(data.data.data);
      // console.log( "update avavta" , data);
    },
  });

  const { mutate: updateProfileMutation } = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (profile) => patchProfile(profile),
    onSuccess: (data) => {
      updateUser(data.data.data);
      // console.log("ipfssd", data);
    },
  });

  const { data: userProfile , isLoading , isError , error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    
  });

  const [profile, setProfile] = useState({
    username: userProfile?.data.data?.username||"",
    fullName: userProfile?.data.data?.fullName||"", 
    email: userProfile?.data.data?.email||"",
    bio: userProfile?.data.data?.bio||"",
    website: userProfile?.data.data?.website||"",
    github: userProfile?.data.data?.github||"",
    twitter: userProfile?.data.data?.twitter||"",
  });

  console.log("userProfile", userProfile);
  console.log("profile", profile);

  


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("avatar", avatar);

    if (avatar) {
      const avatarFormData = new FormData();
      avatarFormData.append("avatar", avatar);
      console.log(avatarFormData.get("avatar"));

      updateAvatarMutation(avatarFormData);
    }
    updateProfileMutation(profile);
    console.log("Profile updated:", profile, avatar);
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);

    console.log("avatar in change", e.target.files[0]);
  };

  if(isLoading)  return   <div className="w-full h-[90vh] flex justify-center items-center">
  <div>
    <InfinitySpin
      visible={true}
      width="200"
      color="#4F46E5"
      ariaLabel="infinity-spin-loading"
    />
  </div>
</div>
  if(isError) return <div>Error: {error.message}</div>


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Profile Settings
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {avatar ? (
                    <img
                      src={avatar ? URL.createObjectURL(avatar) : ""}
                      alt="Profile"
                      className="w-24 h-20 rounded-full"
                    />
                  ) : userProfile?.data.data.avatar ? (
                    <img
                      src={userProfile?.data.data.avatar}
                      alt="Profile"
                      className="w-24 h-20 rounded-full"
                    />
                  ) : (
                    <svg
                      className="w-12 h-12 text-gray-400 dark:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>
                <Input onChange={handleAvatarChange} type="file" />
              </div>
            </div>

            {/* Profile form fields */}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Username
              </label>
              <input
                disabled={true}
                type="text"
                id="username"
                value={profile.username || userProfile?.data.data.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={profile.fullName }
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={profile.email }
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Bio
              </label>
              <input
                type="text"
                id="bio"
                value={profile.bio }
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Website
              </label>
              <input
                type="text"
                id="website"
                value={profile.website }
                onChange={(e) =>
                  setProfile({ ...profile, website: e.target.value })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="github"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Github
              </label>
              <input
                type="text"
                id="github"
                value={profile.github }
                onChange={(e) =>
                  setProfile({ ...profile, github: e.target.value })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="twitter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Twitter
              </label>
              <input
                type="text"
                id="twitter"
                value={profile.twitter }
                onChange={(e) =>
                  setProfile({ ...profile, twitter: e.target.value })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
