import React, { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Api from "@/api";

const chartConfig = {
  desktop: {
    label: "Temp",
    color: "hsl(220, 70%, 50%)",
  },
  mobile: {
    label: "Hum",
    color: "hsl(340, 75%, 55%)",
  },
} satisfies ChartConfig;

const EnvironmentaAnalytics = () => {
  const [timeRange, setTimeRange] = React.useState("1 hour");
  const [chartData, setChartData] = useState();
  const [, setloading] = useState(false);

  const dateFormatter = (value: string) => {
    const parts = value.split(", ");
    const timeParts = parts[1].split(":");

    if (timeRange == "7 days") {
      const day = parts[0].split("/");
      return `${day[0]}/${day[1]}`;
    }
    const minutes = timeParts[1]; // Extract just the minutes
    const hours = timeParts[0];

    // Format as hour:minute
    return `${hours}:${minutes}`;
  };
  useEffect(() => {
    const getAnalytics = async () => {
      try {
        setloading(true);
        const response = await Api.post("/weather/indoorAnalytics", {
          duration: timeRange,
        });

        if (response?.data?.data) {
          // Format data if needed, each item should have timestamp, temperature, humidity
          setChartData(response.data.data);
          console.log(response?.data?.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    getAnalytics();
  }, [timeRange]); // Refetch when timeRange changes
  return (
    <div>
      <Card className="border-gray-500!">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b border-gray-500! py-5 sm:flex-row ">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Indoor Ennironment Analytics</CardTitle>
            <CardDescription>
              {`Displaying temperature and humidity data for the last ${timeRange}`}
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="1 hour" className="rounded-lg">
                Last 1 hour
              </SelectItem>
              <SelectItem value="24 hours" className="rounded-lg">
                Today
              </SelectItem>
              <SelectItem value="7 days" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} horizontal={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => dateFormatter(value)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => dateFormatter(value)}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="temperature"
                type="natural"
                fill="url(#fillMobile)"
                stroke="var(--color-mobile)"
                stackId="a"
              />
              <Area
                dataKey="humidity"
                type="natural"
                fill="url(#fillDesktop)"
                stroke="var(--color-desktop)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentaAnalytics;
