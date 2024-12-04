import "./animation.css";
import { useEffect, useRef, useState } from "react";
export default function CodeAnimation({
  circleSize,
  ballState,
}: {
  circleSize: number;
  ballState: {
    code: string;
    slide: boolean;
  };
}) {
  const codeBoxRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<string[]>(["", "", "", "", ""]);
  const firstRowElem = codeBoxRef.current?.querySelector(
    "#code-0"
  ) as HTMLDivElement;

  if (codeBoxRef.current) {
    codeBoxRef.current.style.height = `${circleSize}px`;
  }

  useEffect(() => {
    if (firstRowElem) {
      firstRowElem.classList.remove("code-slide-add");
      setRows((prevRows) => {
        if (ballState.slide) {
          const updatedRows = [ballState.code, ...prevRows.slice(0, 4)];
          void firstRowElem.offsetWidth;
          firstRowElem.classList.add("code-slide-add");
          return updatedRows;
        } else {
          const updatedRows = [...prevRows];
          updatedRows[0] = ballState.code;
          return updatedRows;
        }
      });
    }
  }, [ballState, firstRowElem]);

  const codeOpacity = (index: number) => {
    switch (index) {
      case 0:
        return "100%";
      case 1:
        return "80%";
      case 2:
        return "50%";
      case 3:
        return "20%";
      case 4:
        return "10%";
    }
  };

  return (
    <div ref={codeBoxRef} className="code-container">
      <div className="code-slide">
        {rows.map((row, index) => (
          <div
            id={`code-${index}`}
            key={index}
            className="code-text"
            style={{ opacity: codeOpacity(index) }}
            dangerouslySetInnerHTML={{ __html: row }}
          ></div>
        ))}
      </div>
    </div>
  );
}
