import React, { useEffect, useState } from "react";
import axios from "axios";

function useGetAllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        // Send API request to fetch all users
        const response = await axios.get("api/user/getUserProfile"); // Update with your actual endpoint

        console.log("Response data:", response.data);
        setAllUsers(response.data); // Update state with the response data
      } catch (error) {
        // Handle errors properly
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error(
            "Error in useGetAllUsers:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something else happened
          console.error("Error:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getUsers(); // Call the API request function when the component mounts
  }, []); // Empty dependency array means this runs once when the component mounts

  return [allUsers, loading];
}

export default useGetAllUsers;
