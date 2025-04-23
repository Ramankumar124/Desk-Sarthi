import Api from "@/api";
import { Switch } from "@/components/ui/switch";
import { useSocket } from "@/context/socket";
import { useEffect, useState } from "react";

import { TbBulb } from "react-icons/tb";

const DeviceControll = () => {
  const [isOn1, setIsOn1] = useState(false);
  const [isOn2, setIsOn2] = useState(false);
  const [isOn3, setIsOn3] = useState(false);
  const [isOn4, setIsOn4] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    async function getRelaysState() {
      const response = await Api.get("/device/getRelayState");
      const device = response.data.data;
console.log(device);

      if (device.relay1 == "ON") setIsOn1(true);
      else setIsOn1(false);
      if (device.relay2 == "ON") setIsOn2(true);
      else setIsOn2(false);
      if (device.relay3 == "ON") setIsOn3(true);
      else setIsOn3(false);
      if (device.relay4 == "ON") setIsOn4(true);
      else setIsOn4(false);
    }
    getRelaysState();
  }, []);

  useEffect(() => {
    socket?.on("relayStatus", (data) => {
      const device = JSON.parse(data?.data);

      if (device.id == "Relay1") {
        if (device.state == "ON") {
          setIsOn1(true);
        } else {
          setIsOn1(false);
        }
      } else if (device.id == "Relay2") {
        if (device.state == "ON") {
          setIsOn2(true);
        } else {
          setIsOn2(false);
        }
      } else if (device.id == "Relay3") {
        if (device.state == "ON") {
          setIsOn3(true);
        } else {
          setIsOn3(false);
        }
      } else if (device.id == "Relay4") {
        if (device.state == "ON") {
          setIsOn4(true);
        } else {
          setIsOn4(false);
        }
      }
    });
  }, [socket]);

  const handleSwitchToggle = async (id: number, state: boolean) => {
    await Api.post("/device/relayToggle", { switchId: id, state: state });
  };
  return (
    <div className="bg-neutral-800 text-white p-4 rounded-xl flex flex-col items-center justify-center">
      <h1 className="text-lg font-bold mb-2  ">Quick Actions</h1>
      <div className="grid grid-rows-2 grid-cols-2  gap-4">
        <div id="button1" className="w-fit bg-blue-500/10 p-3 rounded-xl">
          <div className="flex  items-center gap-2">
            <div className="p-3 bg-blue-500/10  rounded-lg">
              <TbBulb className="text-blue-400 text-2xl" />
            </div>
            <div>
              <p className="font-semibold">Smart Light</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-xl mt-3">
            <p>On</p>
            <Switch
              checked={isOn1}
              onCheckedChange={setIsOn1}
              onClick={() => handleSwitchToggle(1, !isOn1)}
              className="scale-110"
            />
          </div>
        </div>
        <div id="button1" className="w-fit bg-blue-500/10 p-3 rounded-xl">
          <div className="flex  items-center gap-2">
            <div className="p-3 bg-blue-500/10  rounded-lg">
              <TbBulb className="text-blue-400 text-3xl" />
            </div>
            <div>
              <p className="font-semibold">Smart Light</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-xl mt-3">
            <p>On</p>
            <Switch
              checked={isOn2}
              onCheckedChange={setIsOn2}
              onClick={() => handleSwitchToggle(2, !isOn2)}
              className="scale-110"
            />
          </div>
        </div>
        <div id="button1" className="w-fit bg-blue-500/10 p-3 rounded-xl">
          <div className="flex  items-center gap-2">
            <div className="p-3 bg-blue-500/10  rounded-lg">
              <TbBulb className="text-blue-400 text-3xl" />
            </div>
            <div>
              <p className="font-semibold">Smart Light</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-xl mt-3">
            <p>On</p>
            <Switch
              checked={isOn3}
              onCheckedChange={setIsOn3}
              onClick={() => handleSwitchToggle(3, !isOn3)}
              className="scale-110"
            />
          </div>
        </div>
        <div id="button1" className="w-fit bg-blue-500/10 p-3 rounded-xl">
          <div className="flex  items-center gap-2">
            <div className="p-3 bg-blue-500/10  rounded-lg">
              <TbBulb className="text-blue-400 text-3xl" />
            </div>
            <div>
              <p className="font-semibold">Smart Light</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-xl mt-3">
            <p>On</p>
            <Switch
              checked={isOn4}
              onCheckedChange={setIsOn4}
              onClick={() => handleSwitchToggle(4, !isOn4)}
              className="scale-110"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceControll;
