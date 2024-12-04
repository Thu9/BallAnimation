import "./App.css";
import { useRef, useState } from "react";
import BounceBall from "./BounceBall";
import CodeAnimation from "./CodeAnimation";

export default function App() {
  const [ballStatus, setBallStatus] = useState<{
    code: string;
    slide: boolean;
  }>({ code: "", slide: false });
  const circleSize = useRef(420);

  return (
    <>
      <section className="main-container">
        <BounceBall
          circleSize={circleSize.current}
          setBallState={setBallStatus}
        />
        <CodeAnimation circleSize={circleSize.current} ballState={ballStatus} />
      </section>
    </>
  );
}
