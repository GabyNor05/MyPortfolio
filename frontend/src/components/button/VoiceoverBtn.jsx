import { React, useState, useRef } from "react";
import voiceover from "../../assets/home/converted_V1.mp3";
import Button from "./Button";
import { Volume2, Pause } from "lucide-react";

function VoiceoverBtn() {
  // 1. Setup state to track play/pause UI
  const [isPlaying, setIsPlaying] = useState(false);

  // 2. Reference the underlying HTML audio element
  const audioRef = useRef(null);

  // 3. Toggle between play and pause states
  const handleVoiceover = () => {
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause(); // Native HTMLMediaElement method
    } else {
      audio.play().catch((error) => {
        console.error("Playback failed due to browser policies:", error);
      });
    }

    setIsPlaying(!isPlaying);
  };
  return (
    <div>
      <audio
        ref={audioRef}
        src= {voiceover}
        onEnded={() => setIsPlaying(false)} // Reset UI when audio finishes
      />

     <Button colour="primary" icon={isPlaying ? <Pause size={12}/> :<Volume2 size={12}/>} label={isPlaying ? "Pause" : "Play"} onClick={handleVoiceover} /> 
    </div>
  );
}

export default VoiceoverBtn;
