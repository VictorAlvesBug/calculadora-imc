import { useEffect, useRef } from "react";
import mapValue from "../hooks/map";

type Label = {
    label: string;
    min: number;
    max: number;
    color: string;
};

type OdometroProps = {
    value: number;
    min: number;
    max: number;
    labels: Label[];
};

export default function Odometro({value, min, max, labels}: OdometroProps){
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        
        if(ctx){
            labels.forEach(label => {
                const minAngle = mapValue({
                    input: label.min, 
                    minInput: min, 
                    maxInput: max, 
                    minOutput: Math.PI, 
                    maxOutput: 2 * Math.PI
                });
                const maxAngle = mapValue({
                    input: label.max, 
                    minInput: min, 
                    maxInput: max, 
                    minOutput: Math.PI, 
                    maxOutput: 2 * Math.PI
                });
                console.log(minAngle.toFixed(2), maxAngle.toFixed(2))
                ctx.beginPath();
                ctx.fillStyle = label.color;
                ctx.moveTo(80, 50)
                ctx.arc(80, 50, 40, minAngle, maxAngle);
                ctx.lineTo(80, 50)
                ctx.fill();
                ctx.closePath();
            })
        }
    }, [min, max, labels]);
    
    return <canvas 
        ref={canvasRef} 
        className="w-44 h-22"
        width={160}
        height={80}/>
}