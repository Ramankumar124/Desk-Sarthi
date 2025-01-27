import React from 'react';
import { GrLocation } from 'react-icons/gr';
import { MdCloudQueue } from 'react-icons/md';
import { WiCloud, WiHumidity, WiStrongWind, WiBarometer, WiThermometer } from 'react-icons/wi';

const WeatherOutDoorInfo = () => {
  return (
<div className="bg-primary rounded-xl p-6 border border-neutral-700/20 hover:border-neutral-600/40 transition-all " >
            <div className="flex justify-between items-start mb-4">
                <div >
                    <h3 className="text-secondary text-sm mb-1" >Weather Info</h3>
                    <div className="flex items-center space-x-2" >
                    <GrLocation className='text-primary text-3xl font-bold '/>
                        <span className="text-white" >Dhaka, Bangladesh</span>
                    </div>
                </div>
                <div className="bg-blue-600/10 p-2 text-blue-600 rounded-lg text-2xl" >
                <MdCloudQueue />
                </div>
            </div>

            <div className="flex items-center justify-between" id="el-8fukabrm">
                <div id="el-l7ujnop2">
                    <h1 className="text-4xl font-bold text-white mb-1" id="el-usenoeet">18°C</h1>
                    <p className="text-blue-400" id="el-2we326uc">Heavy Rain</p>
                </div>
                <div className="text-right" id="el-um794ynh">
                    <p className="text-gray-400 text-sm mb-1" id="el-x64rq72u">Humidity</p>
                    <p className="text-white text-lg" id="el-wicj3ipq">48.2%</p>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-700/20" id="el-110jpqv6">
                <div className="flex items-center justify-between text-sm" id="el-ii8wjtsd">
                    <div className="text-center" id="el-9w8t322i">
                        <p className="text-gray-400 mb-1" id="el-n5dqnj7u">Wind</p>
                        <p className="text-white" id="el-rqnwt1h8">12 km/h</p>
                    </div>
                    <div className="text-center" id="el-afla1o7v">
                        <p className="text-gray-400 mb-1" id="el-ubfp1vya">Pressure</p>
                        <p className="text-white" id="el-3ifh3yza">1014 hPa</p>
                    </div>
                    <div className="text-center" id="el-8vgfqvmu">
                        <p className="text-gray-400 mb-1" id="el-nm97qrdv">Visibility</p>
                        <p className="text-white" id="el-2kxt5rl6">10 km</p>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default WeatherOutDoorInfo;