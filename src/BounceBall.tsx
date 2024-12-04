import "./animation.css";
import { useEffect, useRef, useState } from "react";
import {
  animationMethod,
  ballPropertyData,
  BouncBallProps,
  codeParser,
} from "./animationMethod";

export default function BounceBall({
  circleSize,
  setBallState,
}: BouncBallProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    if (startAnimation) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      const radius = canvasWidth / 2;

      let dropBall = false;
      let fadeInComplete = false;

      let mouseX = 0;
      let mouseY = 0;

      const ball = {
        x: centerX,
        y: centerY,
        vx: 4,
        vy: 4,
        radius: 42,
        speed: 8, // 공 속도
        opacity: 0, // 초기 투명도
        gravity: 0.2, // 중력 값
        bounce: 0.8, // 튕길 때의 에너지 유지 비율
        avoidanceForce: 0.8, // 회피
      };

      const mouseAvoidanceRadius = ball.radius + 25;

      // 공 그리기
      const drawBall = () => {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.beginPath();
        context.globalAlpha = ball.opacity;
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        context.fillStyle = "#B6F361";
        context.fill();
        context.globalAlpha = 1.0;
        context.closePath();
      };

      const fadeInAnimation = () => {
        if (ball.opacity < 1) {
          ball.opacity += 0.02;
          setBallState({
            code: codeParser({
              method: animationMethod.FadeIn,
              param1: ball.opacity,
            }),
            slide: ball.opacity < 0.04 ? true : false,
          });
          drawBall();
          requestAnimationFrame(fadeInAnimation);
        } else {
          fadeInComplete = true;
          dropBall = true; //떨어뜨리기 시작
        }
      };

      const dropBallCheck = () => {
        if (dropBall) {
          ball.vy += ball.gravity;
          ball.y += ball.vy;

          if (ball.y + ball.radius > canvasHeight) {
            dropBall = false; // 튕기기 애니메이션 준비 완료
          }
        }
      };

      // 충돌 후 반사 벡터에 랜덤 변동 추가
      const bounceBall = () => {
        const angle = (Math.random() * 90 + 45) * (Math.PI / 180);
        const baseAngle = Math.atan2(ball.vy, ball.vx);
        const newAngle = baseAngle + angle;
        ball.vx = Math.cos(newAngle) * ball.speed;
        ball.vy = Math.sin(newAngle) * ball.speed;

        setBallState({
          code: codeParser({
            param1: ball.x,
            param2: ball.y,
            method: animationMethod.Bounce,
          }),
          slide: true,
        });
      };

      const avoidMouse = () => {
        const dx = ball.x - mouseX;
        const dy = ball.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseAvoidanceRadius) {
          const angle = Math.atan2(dy, dx); // 마우스 방향의 각도
          const avoidX = Math.cos(angle) * ball.avoidanceForce;
          const avoidY = Math.sin(angle) * ball.avoidanceForce;

          // if (angle >= 0 && angle <= Math.PI / 2) {
          //   // 1사분면: 마우스가 오른쪽 위에서 접근
          //   console.log('1st Quadrant: Top Right');
          //   canvas.classList.add('custom-cursor');
          // } else if (angle > Math.PI / 2 && angle <= Math.PI) {
          //   // 2사분면: 마우스가 왼쪽 위에서 접근
          //   console.log('2nd Quadrant: Top Left');
          // } else if (angle >= -Math.PI && angle < -Math.PI / 2) {
          //   // 3사분면: 마우스가 왼쪽 아래에서 접근
          //   console.log('3rd Quadrant: Bottom Left');
          // } else if (angle >= -Math.PI / 2 && angle < 0) {
          //   // 4사분면: 마우스가 오른쪽 아래에서 접근
          //   console.log('4th Quadrant: Bottom Right');
          // }

          // 공의 속도를 점진적으로 변경하여 부드럽게 회피하도록 설정
          ball.vx += avoidX;
          ball.vy += avoidY;
        }
      };

      const updateBallPosition = () => {
        if (fadeInComplete && !dropBall) {
          avoidMouse();
          ball.vy += ball.gravity;

          ball.x += ball.vx;
          ball.y += ball.vy;

          // 공의 중심에서 원의 중심까지의 거리 계산
          const distFromCenter = Math.sqrt(
            (ball.x - centerX) ** 2 + (ball.y - centerY) ** 2
          );

          // 공이 원 밖으로 나가면 튕기기
          if (distFromCenter + ball.radius > radius) {
            const correctionFactor = (radius - ball.radius) / distFromCenter;
            ball.x = centerX + (ball.x - centerX) * correctionFactor;
            ball.y = centerY + (ball.y - centerY) * correctionFactor;

            bounceBall();
          }
        }
        dropBallCheck();
        drawBall();
      };

      const animate = () => {
        updateBallPosition();
        requestAnimationFrame(animate);
      };

      const handleMouseMove = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
      };

      fadeInAnimation();
      animate();

      canvas.addEventListener("mousemove", handleMouseMove);
      return () => {
        canvas.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [setBallState, startAnimation]);

  const setBallProperty = () => {
    ballPropertyData.forEach((_, index) => {
      setTimeout(() => {
        setBallState({
          code: codeParser({ index, method: animationMethod.Property }),
          slide: true,
        });
        if (index === ballPropertyData.length - 1) {
          setStartAnimation(true);
        }
      }, 100 * index);
    });
  };

  window.addEventListener("load", setBallProperty);

  return (
    <div className="canvas-ball-container">
      <canvas
        ref={canvasRef}
        width={circleSize}
        height={circleSize}
        className="canvas-circle"
      />
    </div>
  );
}
