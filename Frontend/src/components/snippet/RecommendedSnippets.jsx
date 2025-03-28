import React from 'react';
import { api } from '../../utils/axiosHelper';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import RecommendedSnippetSkeleton from '../skeletons/RecommendedSnippetSkeleton';
const getReccomendations = (tags) => api.get(`snippet/recommended-snippets`, {params : {tags}});
const RecommendedSnippets = ({tags , id}) => {
    const navigate = useNavigate();
    console.log("from recom" , tags || null);
    

    const {data : recommendedSnippets , isLoading , isError , error} = useQuery({
        queryKey : ['recommended-snippets' , tags],
        queryFn : () => getReccomendations(tags)
    })

    // console.log( "recom",recommendedSnippets);
    const handleView = (snippet)=>{
        console.log("view");
        navigate(`/snippet/details/?title=${snippet.title}&id=${snippet._id}`);
    }

    const RecommendedCard = ({snippet})=>{

        // console.log("single snippet" , snippet);
        

        return(
            <div className="bg-gray-800 p-4 border border-gray-700 rounded-md m-"> 
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <img src={snippet?.owner?.avatar} alt="profile" className="w-12 h-12 rounded-full"/>
                        <div className="ml-4">
                            <h1 className="text-lg font-semibold">{snippet .owner?.fullName || snippet.owner?.username }</h1>
                            <p className="text-sm text-gray-400">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {/* <button className="bg-blue-500 text-white px-4 py-1 rounded-md">Follow</button> */}
                        <button onClick={()=>handleView(snippet)} className="bg-gray-700 text-white px-4 py-1 ml-2 rounded-md">View</button>
                    </div>
                </div>
                <div className="mt-4">
                    <h1 className="text-xl font-semibold">{snippet?.title}</h1>
                    <p className="text-gray-400 mt-2">{snippet?.description}</p>
            </div>
            </div>
        )
    }

    return (
        <div className="w-full rounded-md border border-gray-800 max-h-screen overflow-scroll mx-4">
            <h1 className="text-xl font-semibold p-4 sticky top-0 bg-gray-700 ">Recommended Snippets</h1>
            {isLoading ?
               ( <>
               <RecommendedSnippetSkeleton/>
               <RecommendedSnippetSkeleton/>
               <RecommendedSnippetSkeleton/>
               <RecommendedSnippetSkeleton/>
               </>
              )
                :
                recommendedSnippets?.data?.data?.filter(snippet => snippet._id != id).map(snippet => <RecommendedCard key={snippet?._id} snippet = {snippet}/>)
                
            
            }
        </div>
    );
};

export default RecommendedSnippets;