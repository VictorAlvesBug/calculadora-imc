import { useEffect, useRef } from 'react';
import mapValue from '../hooks/map';

export enum Colors {
  slate = '#475569',
  gray = '#4b5563',
  zinc = '#52525b',
  neutral = '#525252',
  stone = '#57534e',
  red = '#dc2626',
  orange = '#ea580c',
  amber = '#d97706',
  yellow = '#ca8a04',
  lime = '#65a30d',
  green = '#16a34a',
  emerald = '#059669',
  teal = '#0d9488',
  cyan = '#0891b2',
  sky = '#0284c7',
  blue = '#2563eb',
  indigo = '#4f46e5',
  violet = '#7c3aed',
  purple = '#9333ea',
  fuchsia = '#c026d3',
  pink = '#db2777',
  rose = '#e11d48',
}

type Label = {
  descricao: string;
  min: number;
  max: number;
  color: Colors;
};

type DesenharArcosProps = {
  ctx: CanvasRenderingContext2D;
  labels: Label[];
  min: number;
  max: number;
  centroX: number;
  centroY: number;
  raioMenor: number;
  raioMaior: number;
};

function desenharArcos({
  ctx,
  labels,
  min,
  max,
  centroX,
  centroY,
  raioMenor,
  raioMaior,
}: DesenharArcosProps) {
  labels.forEach((label) => {
    const minAngle = mapValue({
      input: label.min,
      minInput: min,
      maxInput: max,
      minOutput: 3/4*Math.PI,
      maxOutput: 9/4*Math.PI,
    });
    const maxAngle = mapValue({
      input: label.max,
      minInput: min,
      maxInput: max,
      minOutput: 3/4*Math.PI,
      maxOutput: 9/4*Math.PI,
    });

    ctx.fillStyle = label.color;
    ctx.beginPath();
    ctx.moveTo(
      centroX + raioMenor * Math.cos(minAngle),
      centroY + raioMenor * Math.sin(minAngle)
    );
    ctx.lineTo(
      centroX + raioMaior * Math.cos(minAngle),
      centroY + raioMaior * Math.sin(minAngle)
    );
    ctx.arc(centroX, centroY, raioMaior, minAngle, maxAngle);
    ctx.lineTo(
      centroX + raioMenor * Math.cos(maxAngle),
      centroY + raioMenor * Math.sin(maxAngle)
    );
    ctx.arc(centroX, centroY, raioMenor, maxAngle, minAngle, true);
    ctx.fill();
    ctx.closePath();
  });
}

type DesenharPonteiroProps = {
  ctx: CanvasRenderingContext2D;
  valor: number;
  min: number;
  max: number;
  centroX: number;
  centroY: number;
  raioMenor: number;
  raioMaior: number;
};

function desenharPonteiro({
  ctx,
  valor,
  min,
  max,
  centroX,
  centroY,
  raioMenor,
  raioMaior,
}: DesenharPonteiroProps) {
  const anguloMedio = mapValue({
    input: valor,
    minInput: min,
    maxInput: max,
    minOutput: 3/4*Math.PI,
    maxOutput: 9/4 * Math.PI,
  });

  const offset = 0.2;
  const anguloMenor = anguloMedio - offset;
  const anguloMaior = anguloMedio + offset;

  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.moveTo(
    centroX + raioMenor * Math.cos(anguloMenor),
    centroY + raioMenor * Math.sin(anguloMenor)
  );
  ctx.lineTo(
    centroX + raioMaior * Math.cos(anguloMedio),
    centroY + raioMaior * Math.sin(anguloMedio)
  );
  ctx.lineTo(
    centroX + raioMenor * Math.cos(anguloMaior),
    centroY + raioMenor * Math.sin(anguloMaior)
  );
  ctx.fill();
  ctx.closePath();
}

export enum TipoLegenda {
  SEM_LEGENDA,
  ESQUERDA,
  DIREITA,
  CIMA,
  BAIXO,
}

type OdometroProps = {
  valor: number;
  min: number;
  max: number;
  labels: Label[];
  tipoLegenda?: TipoLegenda;
};

export default function Odometro({
  valor,
  min,
  max,
  labels,
  tipoLegenda,
}: OdometroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      throw new Error('Erro: Canvas não encontrado');
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Erro: Contexto do canvas não encontrado');
    }

    const centroX = 400;
    const centroY = 400;
    const raioMenorArco = 200;
    const raioMaiorArco = 350;

    const raioMenorPonteiro = raioMenorArco / 5;
    const raioMaiorPonteiro = (raioMenorArco + raioMaiorArco) / 2;

    desenharArcos({
      ctx,
      labels,
      min,
      max,
      centroX,
      centroY,
      raioMenor: raioMenorArco,
      raioMaior: raioMaiorArco,
    });

    desenharPonteiro({
      ctx,
      valor,
      min,
      max,
      centroX,
      centroY,
      raioMenor: raioMenorPonteiro,
      raioMaior: raioMaiorPonteiro,
    });

    return () => {
      canvas && ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [min, max, labels, valor]);

  let legenda = null;

  tipoLegenda = tipoLegenda || TipoLegenda.SEM_LEGENDA;

  const retornarFlexDirectionGraficoLegenda = (tipoLegenda: TipoLegenda) => {
    switch (tipoLegenda) {
      case TipoLegenda.BAIXO:
        return 'flex-col';
      case TipoLegenda.CIMA:
        return 'flex-col-reverse';
      case TipoLegenda.DIREITA:
        return 'flex-row';
      case TipoLegenda.ESQUERDA:
        return 'flex-row-reverse';
      default:
        return 'flex-row';
    }
  };

  const retornarFlexDirectionItensLegenda = (tipoLegenda: TipoLegenda) => {
    switch (tipoLegenda) {
      case TipoLegenda.BAIXO:
      case TipoLegenda.CIMA:
        return 'flex-row';
      case TipoLegenda.DIREITA:
      case TipoLegenda.ESQUERDA:
        return 'flex-col';
      default:
        return 'flex-row';
    }
  };

  if (tipoLegenda) {
    legenda = (
      <div
        className={`flex ${retornarFlexDirectionItensLegenda(
          tipoLegenda
        )} flex-wrap items-start justify-between gap-x-3 gap-y-2 max-w-[15rem]`}
      >
        {labels.map((label) => {
          return (
            <div className="flex flex-row items-center justify-center gap-1">
              <span
                className="w-3 h-3 border border-black"
                style={{ backgroundColor: label.color }}
              ></span>
              <span className="text-xs">{label.descricao}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`flex ${retornarFlexDirectionGraficoLegenda(
        tipoLegenda
      )} items-center justify-center gap-4`}
    >
      <canvas ref={canvasRef} className="w-40 h-40" width={800} height={800} />
      {legenda}
    </div>
  );
}
