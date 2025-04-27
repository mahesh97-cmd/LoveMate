import axios from 'axios'
import React, { useEffect ,useState} from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests } from '../utils/requestsSlice'
import { useNavigate } from 'react-router-dom'

const Requests = () => {
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()
  const requests=useSelector((state)=>state.requests?.requests)
  const dispatch=useDispatch()
  const getReceivedRequests=async()=>{
    try {
      const res=await axios.get(BASE_URL+"/getReceivedRequests",{withCredentials:true})
      dispatch(addRequests(res?.data))
      console.log(res.data,"reqqqqq")
    } catch (error) {
      console.error(error)
    }
    }
    console.log(requests,"all requests")

    useEffect(()=>{
      if(!requests){
        getReceivedRequests()
      }
     setLoading(false)
    },[])
    
  return requests && (
    <div  className="min-h-screen bg-gray-100 p-6">
    <h2 className="text-3xl font-bold text-center mb-8 text-pink-600">
      Your Requests
    </h2>

    {loading ? (
      <div className="flex justify-center">
        <img
          src="https://i.gifer.com/ZZ5H.gif" // Replace with your loading gif if needed
          alt="Loading..."
          className="w-16 h-16"
        />
      </div>
    ) : requests.length === 0 ? (
      <p className="text-center text-gray-500">No matches found yet.</p>
    ) : (
      <div  className="bg-white rounded-xl shadow-md p-4 max-w-3xl mx-auto">
        {requests.map((request) => (
          <div
            key={request._id}
            className="flex items-center justify-between border-b border-gray-200 py-4 last:border-b-0"
          >
            <div className="flex items-center space-x-4">
              <img
              onClick={()=>{navigate("/user-profile",{state:{id:request._id}})}}
                src={
                  request.profilePic ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover border-2 border-pink-500"
              />
              <div>
                <h3 className="text-md font-semibold">{request.username}</h3>
                <p className="text-sm text-gray-500">{request.caption}</p>
                <p className="text-xs text-gray-400 capitalize">
                  {request.gender}
                </p>
              </div>
            </div>
            <button
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1 rounded-full text-sm"
              onClick={() =>console.log(request._id)}
            >
             accept
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
  )
}

export default Requests