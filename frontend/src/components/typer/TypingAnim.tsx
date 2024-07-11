import { TypeAnimation } from "react-type-animation";
import "../../index.css"

const TypingAnim = () => {
  return (
    <TypeAnimation
      sequence={[
        "CipherGPT🤖",
        2000,
        "OpenAI",
        2000,
        " GPT-3.5 Turbo",
        2500,
      ]}
      speed={50}
      style={{
        fontSize: "50px",
        color: "white",
        display: "inline-block",
        textShadow: "1px 1px 20px #000",
      }}
      className="typing-animation"
      repeat={Infinity}
    />
  );
};

export default TypingAnim;
