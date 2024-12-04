export interface BouncBallProps {
  circleSize: number;
  setBallState: React.Dispatch<
    React.SetStateAction<{ code: string; slide: boolean }>
  >;
}

export enum animationMethod {
  Property = "Property",
  FadeIn = "FadeIn",
  Bounce = "bounce",
}

enum colorType {
  navy = "#1F51B3",
  blue = "#44C1F9",
  skyBlue = "#8CDCFE",
  yellow = "#DCDC8B",
  orange = "#F6CB12",
  pink = "#B670D6",
  lightGreen = "#B5C384",
}

//랜덤한 소수를 000.0000 자릿수로 변환
const positionParser = (num: number): string => {
  const fixedNum = num.toFixed(4);
  const [integer, decimal] = fixedNum.split(".");
  const paddedInteger = integer.padStart(3, "0");

  return `${paddedInteger}.${decimal}`;
};

//string을 color를 설정한 dom으로 변환
const codeStyle = (string: string, color: string) => {
  return `<span style="color: ${color}">${string}</span>`;
};

export const ballPropertyData: string[] = [
  `${codeStyle("load...", colorType.yellow)}`,

  `${codeStyle("const", colorType.navy)} ` +
    `${codeStyle("ball", colorType.blue)} = ` +
    `${codeStyle("{", colorType.pink)}`,

  `${codeStyle("velocityX", colorType.skyBlue)}: ` +
    `${codeStyle("4", colorType.lightGreen)},`,

  `${codeStyle("velocityY", colorType.skyBlue)}: ` +
    `${codeStyle("4", colorType.lightGreen)},`,

  `${codeStyle("radius", colorType.skyBlue)}: ` +
    `${codeStyle("50", colorType.lightGreen)},`,

  `${codeStyle("gravity", colorType.skyBlue)}: ` +
    `${codeStyle("0.2", colorType.lightGreen)},`,

  `${codeStyle("bounceEnergy", colorType.skyBlue)}: ` +
    `${codeStyle("0.8", colorType.lightGreen)}`,

  `${codeStyle("x", colorType.skyBlue)}: ` +
    `${codeStyle("canvasRef", colorType.blue)}.` +
    `${codeStyle("current", colorType.blue)}.` +
    `${codeStyle("width", colorType.blue)} / ` +
    `${codeStyle("2", colorType.lightGreen)},`,

  `${codeStyle("y", colorType.skyBlue)}: ` +
    `${codeStyle("canvasRef", colorType.blue)}.` +
    `${codeStyle("current", colorType.blue)}.` +
    `${codeStyle("height", colorType.blue)} / ` +
    `${codeStyle("2", colorType.lightGreen)},`,

  `${codeStyle("}", colorType.pink)};`,
];

export const codeParser = ({
  method,
  param1,
  param2,
  index,
}: {
  method: animationMethod;
  param1?: number;
  param2?: number;
  index?: number;
}): string => {
  switch (method) {
    case animationMethod.Property:
      if (index != undefined) {
        return ballPropertyData[index];
      } else {
        return "";
      }
    case animationMethod.FadeIn: {
      const code =
        `${codeStyle("ball", colorType.blue)}.` +
        `${codeStyle("opacity", colorType.skyBlue)} = ` +
        `${
          param1 &&
          codeStyle(Math.round(param1 * 99 + 1) + "%", colorType.lightGreen)
        };`;
      return code;
    }
    case animationMethod.Bounce: {
      const code =
        `${codeStyle("ball", colorType.blue)}.` +
        `${codeStyle("pos", colorType.blue)}.` +
        `${codeStyle("x", colorType.skyBlue)} = ` +
        `${param1 && positionParser(param1)}` +
        `${codeStyle(",", colorType.orange)} ` +
        `${codeStyle("ball", colorType.blue)}.` +
        `${codeStyle("pos", colorType.blue)}.` +
        `${codeStyle("y", colorType.skyBlue)} = ` +
        `${param2 && positionParser(param2)};`;
      return code;
    }
  }
};
