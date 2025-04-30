import axios from "axios";
const getOutDoorWeather= async()=>{
 const response=await axios.get("http://localhost:3000/api/v1/weather/outdoor-climate");
 return response?.data?.data;
 
}

export { getOutDoorWeather};