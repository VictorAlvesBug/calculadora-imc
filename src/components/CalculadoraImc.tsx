import InputSeletor from "./InputSeletor";

export default function CalculadoraImc(){
    return (
      <div className="flex flex-col w-full h-screen justify-start pt-16 items-center bg-gray-200">
        <div className="bg-gray-300">
          <InputSeletor 
            labelUp='Altura' 
            labelDown='metros'
            value={1.70}
            min={1}
            max={2.25}
            step={0.01}
            formatter={(value: number) => value.toFixed(2)}/>
        </div>
      </div>
    );
}