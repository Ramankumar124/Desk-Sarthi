import { useEffect, useState } from "react";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToRgba, rgbaToHsva } from "@uiw/color-convert";
import { useSocket } from "@/context/socket";
import { useDebounce } from 'use-debounce';
interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}
const LightControll = () => {
  const [rgba, setRgba] = useState<RGBA>({ r: 255, g: 128, b: 6, a: 1 });
  const [debouncedRgba]=useDebounce(rgba,500);
  const {socket}=useSocket();


  const handleWheelChange = (color: { hsva: { h: number; s: number; v: number; a: number } }) => {
    const newRgba = hsvaToRgba(color.hsva);
    setRgba(newRgba);
  };

  useEffect(() => {
  if(socket){
    console.log(debouncedRgba);
    
    socket.emit("rgbChange",{rgba:debouncedRgba});
  }
    
  }, [debouncedRgba])
  
  // const handleSliderChange = (key: keyof RGBA, value: number) => {
  //   setRgba((prev) => ({ ...prev, [key]: value }));
  // };

  return (
    <div className="w-full  flex flex-col">
      <div className="bg-[#2A2A2A] rounded-xl p-6  transition-all">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-400 text-sm">RGB Color Control</h3>
          <button className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full transition-colors">
            Save Preset
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center w-fit h-fit mx-auto rounded-full">
            <Wheel color={rgbaToHsva(rgba)} onChange={handleWheelChange} />
            <span className="text-gray-400  mt-4">Preview</span>
            <div
              style={{
                width: "50%",
                height: 34,
                marginTop: 4,
                borderRadius: 10,
                background: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`,
              }}
            ></div>
          </div>

          <div className="hidden md:block space-y-6">
            <div className=" md:space-y-4">
              <div>
                <div className="flex justify-between text-sm md:mb-2">
                  <span className="text-gray-400">Red</span>
                  <span className="text-white">{rgba?.r}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgba?.r}
                    onChange={(e) =>
                      setRgba({ ...rgba, r: Number(e.target.value) })
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-neutral-800 to-red-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm  md:mb-2">
                  <span className="text-gray-400">Green</span>
                  <span className="text-white">{rgba?.g}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgba?.g}
                    onChange={(e) =>
                      setRgba({ ...rgba, g: Number(e.target.value) })
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-neutral-800 to-green-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm md:mb-2">
                  <span className="text-gray-400">Blue</span>
                  <span className="text-white">{rgba?.b}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgba?.b}
                    onChange={(e) =>
                      setRgba({ ...rgba, b: Number(e.target.value) })
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-neutral-800 to-blue-500"
                  />
                </div>
              </div>
              <div className="block">
                <div className=" flex justify-between text-sm md:mb-2">
                  <span className="text-gray-400">Brightness</span>
                  <span className="text-white">80%</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={rgba?.a}
                    onChange={(e) =>
                      setRgba({ ...rgba, a: Number(e.target.value) })
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-neutral-800 to-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" mt-6 w-full">
          <h4 className="text-gray-400 text-sm mb-4">Saved Presets</h4>
          <div className="grid grid-cols-6 gap-3">
            <button className="w-8 h-8 rounded-full bg-red-500 hover:ring-2 hover:ring-offset-2 hover:ring-offset-[#2A2A2A] hover:ring-red-500 transition-all"></button>
            <button className="w-8 h-8 rounded-full bg-blue-500 hover:ring-2 hover:ring-offset-2 hover:ring-offset-[#2A2A2A] hover:ring-blue-500 transition-all"></button>
            <button className="w-8 h-8 rounded-full bg-green-500 hover:ring-2 hover:ring-offset-2 hover:ring-offset-[#2A2A2A] hover:ring-green-500 transition-all"></button>
            <button className="w-8 h-8 rounded-full bg-yellow-500 hover:ring-2 hover:ring-offset-2 hover:ring-offset-[#2A2A2A] hover:ring-yellow-500 transition-all"></button>
            <button className="w-8 h-8 rounded-full bg-purple-500 hover:ring-2 hover:ring-offset-2 hover:ring-offset-[#2A2A2A] hover:ring-purple-500 transition-all"></button>
            <button className="w-8 h-8 rounded-full bg-neutral-800 hover:ring-2 hover:ring-offset-2 hover:ring-offset-[#2A2A2A] hover:ring-white transition-all flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightControll;
