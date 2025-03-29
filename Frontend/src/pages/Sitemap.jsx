import React, { useEffect } from 'react';
import { api } from '../utils/axiosHelper';
import { useQuery } from '@tanstack/react-query';

const fetchSiteMap = api.get('/sitemap.xml');


const Sitemap = () => {

    const [siteMap , setSiteMap] = React.useState(null);

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const response = await fetchSiteMap;
                setSiteMap(response.data);
            } catch (error) {
                console.error('Error fetching sitemap:', error);
            }
        };

        fetchData();
    })

    console.log(siteMap ,"data");
    

return (
    siteMap
  );
}

export default Sitemap;
