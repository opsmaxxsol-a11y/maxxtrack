import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = "http://localhost:5000";

export default function App(){
  const [id,setId]=useState('');
  const [data,setData]=useState(null);

  const fetchData = async ()=>{
    const res = await axios.get(`${API}/track/${id}`);
    setData(res.data);
  };

  useEffect(()=>{
    if(id){
      const i=setInterval(fetchData,5000);
      return ()=>clearInterval(i);
    }
  },[id]);

  useEffect(()=>{
    if(data && window.google){
      const [lat,lng]=data.location.split(",").map(Number);

      const map = new window.google.maps.Map(
        document.getElementById("map"),
        { center:{lat,lng}, zoom:12 }
      );

      new window.google.maps.Marker({
        position:{lat,lng},
        map
      });
    }
  },[data]);

  return (
    <div style={{textAlign:"center"}}>
      <h1>🚚 MaxxTrack PRO</h1>

      <input placeholder="Tracking ID" onChange={e=>setId(e.target.value)}/>
      <button onClick={fetchData}>Track</button>

      {data && (
        <>
          <h3>Status: {data.status}</h3>
          <p>Destination: {data.destination}</p>
          <div id="map" style={{height:"400px"}}></div>
        </>
      )}
    </div>
  );
}
