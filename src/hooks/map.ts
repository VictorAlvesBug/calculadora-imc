type MapProps = {
    input: number;
    minInput: number;
    maxInput: number;
    minOutput: number;
    maxOutput: number;
};

export default function mapValue({
    input,
    minInput,
    maxInput,
    minOutput,
    maxOutput 
}: MapProps) {
    const rangeInput = maxInput - minInput;
    const rangeOutput = maxOutput - minOutput;
    return (input - minInput) / rangeInput * rangeOutput + minOutput;

}