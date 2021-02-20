import React from "react";
import { Line } from "react-chartjs-2"
import { ChartData } from "chart.js"


const Statistics: React.FC = () => {
    const data: ChartData = React.useMemo(() => {
        return {
            labels: ["1", "2", "3"],
            datasets: [{
                data: [100, 50, 200],
                backgroundColor: [
                    "rgb(255,255,255)",
                ]
            }]
        }
    }, [])
    return (
        <div className="stats">

            <Line
                data={data}
                options={{
                    responsive: true,
                    maintainAspectRatio: false
                }}
            />
        </div>
    )
}

export default Statistics;