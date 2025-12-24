import { useEffect, useState } from "react";

const colors = [
  "#ffff"
];

const AnimatedText = ({ text }) => {
  const words = text.split(" ");
  const [visibleWords, setVisibleWords] = useState([]);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setVisibleWords((prev) => [...prev, words[index]]);
      index++;

      if (index >= words.length) {
        clearInterval(interval);
      }
    }, 280); // ⏳ SLOWER (was 120)

    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="text-lg leading-relaxed">
      {visibleWords.map((word, i) => (
        <span
          key={i}
          className={`
            inline-block mr-1
            transition-all duration-1000 ease-out
            animate-wordFade
            ${colors[i % colors.length]}
          `}
        >
          {word}
        </span>
      ))}
    </p>
  );
};

export default AnimatedText;
