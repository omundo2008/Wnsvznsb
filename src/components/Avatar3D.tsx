import { useEffect, useRef, useState } from 'react';
import { Volume2, RefreshCw, Play, Pause } from 'lucide-react';
import { playFeedback } from '../utils/audio';

interface Avatar3DProps {
  gestureKey: string;
  language: 'pt' | 'en' | 'es';
}

interface Joint3D {
  x: number;
  y: number;
  z: number;
}

const uiLabels = {
  pt: {
    avatarTitle: 'Intérprete 3D Bot-LGP',
    gesturing: 'A sinalizar:',
    idleStatus: 'A aguardar frase...',
    speed: 'Velocidade',
    play: 'Reproduzir',
    pause: 'Pausar',
    reset: 'Reiniciar',
    viewAngle: 'Rodar Ângulo',
    description: 'Boneco 3D virtual gerando gestos de apoio e Língua Gestual.',
  },
  en: {
    avatarTitle: '3D Bot-SL Interpreter',
    gesturing: 'Signing:',
    idleStatus: 'Waiting for text...',
    speed: 'Speed',
    play: 'Play',
    pause: 'Pause',
    reset: 'Reset',
    viewAngle: 'Rotate View',
    description: '3D virtual avatar generating support gestures and Sign Language.',
  },
  es: {
    avatarTitle: 'Intérprete 3D Bot-LSE',
    gesturing: 'Haciendo señas:',
    idleStatus: 'Esperando texto...',
    speed: 'Velocidad',
    play: 'Reproducir',
    pause: 'Pausar',
    reset: 'Reiniciar',
    viewAngle: 'Girar Vista',
    description: 'Avatar 3D virtual que simula gestos de apoyo y Lengua de Señas.',
  }
};

export default function Avatar3D({ gestureKey, language }: Avatar3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [activeGestureName, setActiveGestureName] = useState<string>('');

  const labels = uiLabels[language] || uiLabels.pt;

  // Track dynamic animation timeline
  const timeRef = useRef<number>(0);

  // Map known keywords/translated cards to general gesture classes
  const getGestureType = (text: string): string => {
    const cleaned = text.toLowerCase().trim();
    if (!cleaned) return 'idle';

    if (cleaned.includes('ajuda') || cleaned.includes('socorro') || cleaned.includes('help') || cleaned.includes('danger') || cleaned.includes('sos')) {
      return 'sos';
    }
    if (cleaned.includes('medico') || cleaned.includes('médico') || cleaned.includes('hospital') || cleaned.includes('doctor') || cleaned.includes('clinica')) {
      return 'medico';
    }
    if (cleaned.includes('banheiro') || cleaned.includes('sanitario') || cleaned.includes('wc') || cleaned.includes('toilet') || cleaned.includes('bano') || cleaned.includes('baño') || cleaned.includes('aseo')) {
      return 'banheiro';
    }
    if (cleaned.includes('agua') || cleaned.includes('água') || cleaned.includes('beber') || cleaned.includes('thirsty') || cleaned.includes('water')) {
      return 'agua';
    }
    if (cleaned.includes('comida') || cleaned.includes('fome') || cleaned.includes('comer') || cleaned.includes('hungry') || cleaned.includes('food')) {
      return 'comida';
    }
    if (cleaned.includes('perdido') || cleaned.includes('onde') || cleaned.includes('where') || cleaned.includes('lost') || cleaned.includes('dónde')) {
      return 'perdido';
    }
    if (cleaned.includes('policia') || cleaned.includes('polícia') || cleaned.includes('police') || cleaned.includes('cop') || cleaned.includes('robbery') || cleaned.includes('asalto')) {
      return 'policia';
    }
    if (cleaned.includes('obrigado') || cleaned.includes('obrigada') || cleaned.includes('thanks') || cleaned.includes('thank you') || cleaned.includes('gracias')) {
      return 'obrigado';
    }
    if (cleaned.includes('sim') || cleaned.includes('yes') || cleaned.includes('sí') || cleaned.includes('ok') || cleaned.includes('sure')) {
      return 'sim';
    }
    if (cleaned.includes('nao') || cleaned.includes('não') || cleaned.includes('no') || cleaned.includes('never') || cleaned.includes('nunca')) {
      return 'nao';
    }
    if (cleaned.includes('surdo') || cleaned.includes('mudo') || cleaned.includes('deaf') || cleaned.includes('write') || cleaned.includes('sordo') || cleaned.includes('muda')) {
      return 'surdo';
    }
    if (cleaned.includes('taxi') || cleaned.includes('táxi') || cleaned.includes('autocarro') || cleaned.includes('ônibus') || cleaned.includes('bus') || cleaned.includes('transport') || cleaned.includes('carro') || cleaned.includes('coche')) {
      return 'transporte';
    }
    if (cleaned.includes('ola') || cleaned.includes('olá') || cleaned.includes('hello') || cleaned.includes('hi') || cleaned.includes('hola')) {
      return 'ola';
    }

    return 'spell'; // Finger spelling gesture if no matching macro gesture is triggered
  };

  const gestureType = getGestureType(gestureKey);

  // Friendly human readable tag for UI
  useEffect(() => {
    if (gestureType === 'idle') {
      setActiveGestureName('');
    } else {
      setActiveGestureName(gestureKey.toUpperCase());
    }
  }, [gestureKey, gestureType]);

  // Main animation frame loop
  useEffect(() => {
    let animationFrameId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resizing with absolute canvas pixel density setup for crisp text / renders
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth * window.devicePixelRatio;
        canvas.height = parent.clientHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dynamic rotation helper
    let currentAutoRotate = 0;

    const render = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      
      // Clear with elegant dark cyber background gradient (#000000 with glowing interface)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw horizontal hologram grid lines at the bottom for beautiful 3D vibe
      ctx.strokeStyle = 'rgba(29,185,84,0.05)';
      ctx.lineWidth = 1;
      for (let j = 0; j < 6; j++) {
        const gridY = height - 10 - j * 12;
        ctx.beginPath();
        ctx.moveTo(30, gridY);
        ctx.lineTo(width - 30, gridY);
        ctx.stroke();
      }

      // Update time if playing
      if (isPlaying) {
        timeRef.current += 0.05 * speed;
      }

      const t = timeRef.current;
      const activeAngle = rotationAngle + currentAutoRotate;

      // Projection values
      const centerX = width / 2;
      const centerY = height / 2 + 10;
      const scaleFactor = Math.min(width, height) * 0.55;

      // 3D Rotation coordinates mapping around Y-axis
      const project = (j: Joint3D): { sx: number; sy: number; sz: number } => {
        // Rotacao Y
        const cosAngle = Math.cos(activeAngle);
        const sinAngle = Math.sin(activeAngle);
        
        let rx = j.x * cosAngle - j.z * sinAngle;
        let rz = j.x * sinAngle + j.z * cosAngle;
        let ry = j.y;

        // Perspective mapping (Z acts as distance/depth)
        const fov = 3;
        const depth = fov / (fov + rz * 0.5);
        
        return {
          sx: centerX + rx * scaleFactor * depth,
          sy: centerY - ry * scaleFactor * depth,
          sz: rz,
        };
      };

      // Base default skeleton joints: values relative to Center (range -1.0 to 1.0)
      let head: Joint3D = { x: 0, y: 0.55, z: 0 };
      let neck: Joint3D = { x: 0, y: 0.35, z: 0 };
      let chest: Joint3D = { x: 0, y: 0.1, z: 0 };
      let waist: Joint3D = { x: 0, y: -0.3, z: 0 };

      // Shoulders
      let leftShoulder: Joint3D = { x: -0.28, y: 0.28, z: 0 };
      let rightShoulder: Joint3D = { x: 0.28, y: 0.28, z: 0 };

      // Elbows
      let leftElbow: Joint3D = { x: -0.42, y: 0.05, z: -0.05 };
      let rightElbow: Joint3D = { x: 0.42, y: 0.05, z: -0.05 };

      // Wrists
      let leftWrist: Joint3D = { x: -0.32, y: -0.15, z: -0.1 };
      let rightWrist: Joint3D = { x: 0.32, y: -0.15, z: -0.1 };

      // Fingers / Tips
      let leftHand: Joint3D = { x: -0.35, y: -0.25, z: -0.12 };
      let rightHand: Joint3D = { x: 0.35, y: -0.25, z: -0.12 };

      // Face accessories / features (for expressions)
      let leftEye: Joint3D = { x: -0.05, y: 0.58, z: 0.11 };
      let rightEye: Joint3D = { x: 0.05, y: 0.58, z: 0.11 };
      let mouthLeft: Joint3D = { x: -0.04, y: 0.5, z: 0.11 };
      let mouthRight: Joint3D = { x: 0.04, y: 0.5, z: 0.11 };
      let mouthMid: Joint3D = { x: 0, y: 0.49, z: 0.115 };

      // Left & Right alert light beacons on head for specific events
      let headLightLeft: Joint3D = { x: -0.09, y: 0.65, z: 0 };
      let headLightRight: Joint3D = { x: 0.09, y: 0.65, z: 0 };

      // Breathing movement (always active)
      const breathing = Math.sin(t * 1.5) * 0.015;
      chest.y += breathing;
      neck.y += breathing * 0.7;
      head.y += breathing * 0.6;
      leftShoulder.y += breathing * 0.8;
      rightShoulder.y += breathing * 0.8;

      // Dynamic Gesture Calculations based on translation key
      if (gestureType === 'sos') {
        // Frantic help/waving gesture. Both arms waving overhead
        leftElbow.x = -0.35 + Math.sin(t * 5) * 0.1;
        leftElbow.y = 0.3 + Math.cos(t * 5) * 0.1;
        
        leftWrist.x = -0.2 - Math.sin(t * 9) * 0.2;
        leftWrist.y = 0.65 + Math.cos(t * 9) * 0.15;
        leftWrist.z = 0.1;

        rightElbow.x = 0.35 - Math.sin(t * 5) * 0.1;
        rightElbow.y = 0.3 + Math.cos(t * 5) * 0.1;

        rightWrist.x = 0.2 + Math.sin(t * 9) * 0.2;
        rightWrist.y = 0.65 - Math.cos(t * 9) * 0.15;
        rightWrist.z = 0.1;

        // Expressive flashing light effect
        headLightLeft.y += 0.03;
        headLightRight.y += 0.03;
      } 
      else if (gestureType === 'medico') {
        // "MÉDICO" pulse check gesture. Left hand flat in front, right hand repeatedly tapping left wrist.
        leftElbow.x = -0.25;
        leftElbow.y = -0.05;
        leftWrist.x = -0.12;
        leftWrist.y = 0.02;
        leftWrist.z = 0.2; // project forward
        
        leftHand.x = -0.08;
        leftHand.y = 0.05;
        leftHand.z = 0.25;

        // Right hand repeatedly reaches in and taps LEFT wrist coordinates {x: -0.12, y: 0.02, z: 0.2}
        const tapCycle = Math.abs(Math.sin(t * 4.5));
        rightElbow.x = 0.25;
        rightElbow.y = -0.05;
        
        rightWrist.x = -0.12 + Math.sin(t * 4.5) * 0.03;
        rightWrist.y = 0.02 + tapCycle * 0.18; // Bounce downwards onto the pulse
        rightWrist.z = 0.21;

        rightHand.x = rightWrist.x + 0.02;
        rightHand.y = rightWrist.y - 0.03;
        rightHand.z = rightWrist.z;
      }
      else if (gestureType === 'banheiro') {
        // Hand outlines WC bounds / pointing gesture downwards
        rightElbow.x = 0.35;
        rightElbow.y = 0.1;
        
        rightWrist.x = 0.15 + Math.sin(t * 3) * 0.12;
        rightWrist.y = -0.15 + Math.cos(t * 3) * 0.08;
        rightWrist.z = 0.15;

        leftElbow.x = -0.25;
        leftWrist.x = -0.2;
        leftWrist.y = -0.15;
      }
      else if (gestureType === 'agua') {
        // "ÁGUA" cup drinking gesture. Left arm idle, right arm handles cup to mouth
        leftElbow.x = -0.35;
        leftWrist.x = -0.25;
        leftWrist.y = -0.2;

        rightElbow.x = 0.2;
        rightElbow.y = 0.02;
        
        // Cycle hand moving towards lips {x: 0, y: 0.5, z: 0.1}
        const tiltCycle = Math.sin(t * 3); // speed oscillation
        const cupFactor = (tiltCycle + 1) / 2; // scale between 0 and 1
        
        rightWrist.x = 0.22 - cupFactor * 0.18;
        rightWrist.y = -0.12 + cupFactor * 0.58; // lift hand high
        rightWrist.z = 0.05 + cupFactor * 0.15; // move close to lips

        rightHand.x = rightWrist.x - 0.02;
        rightHand.y = rightWrist.y + 0.03;
        rightHand.z = rightWrist.z;

        // Head tilts back slightly as hand rises
        head.y += cupFactor * 0.03;
        head.z -= cupFactor * 0.02;
      }
      else if (gestureType === 'comida') {
        // "COMIDA" rubbing belly gesture
        leftElbow.x = -0.35;
        leftWrist.x = -0.25;
        leftWrist.y = -0.2;

        rightElbow.x = 0.18;
        rightElbow.y = -0.1;
        
        // Circular stomach rubbing movement
        rightWrist.x = 0.05 + Math.sin(t * 4.5) * 0.09;
        rightWrist.y = -0.18 + Math.cos(t * 4.5) * 0.09;
        rightWrist.z = 0.18; // pushed in front of belly

        rightHand.x = rightWrist.x;
        rightHand.y = rightWrist.y - 0.02;
        rightHand.z = rightWrist.z;

        // Head nods slowly
        head.y += Math.sin(t * 3) * 0.015;
      }
      else if (gestureType === 'perdido') {
        // "PERDIDO/ONDE?" shrugging, turning head, both arms raising outwards
        const cycle = Math.sin(t * 2);
        
        // Rotate head Y left-right
        head.x += cycle * 0.03;
        leftEye.x += cycle * 0.01;
        rightEye.x += cycle * 0.01;

        // Shoulder shrugs up-down
        const shrug = Math.abs(cycle) * 0.05;
        leftShoulder.y += shrug;
        rightShoulder.y += shrug;
        neck.y += shrug * 0.5;

        // Arms bend outwards, hands pointing up/out
        leftElbow.x = -0.38;
        leftElbow.y = 0.15;
        leftWrist.x = -0.4;
        leftWrist.y = 0.25;
        leftWrist.z = 0.1;

        rightElbow.x = 0.38;
        rightElbow.y = 0.15;
        rightWrist.x = 0.4;
        rightWrist.y = 0.25;
        rightWrist.z = 0.1;
      }
      else if (gestureType === 'policia') {
        // Sirens! Flashing lights, right hand looping in circles overhead simulating beacon
        rightElbow.x = 0.2;
        rightElbow.y = 0.32;
        
        // Loop hand overhead trace circle
        rightWrist.x = Math.sin(t * 8) * 0.18;
        rightWrist.y = 0.65 + Math.cos(t * 8) * 0.08;
        rightWrist.z = Math.cos(t * 8) * 0.18;

        rightHand.x = rightWrist.x;
        rightHand.y = rightWrist.y + 0.02;
        rightHand.z = rightWrist.z;

        leftElbow.x = -0.3;
        leftWrist.x = -0.22;
        leftWrist.y = -0.1;
      }
      else if (gestureType === 'obrigado') {
        // ASL 'Obrigado / Thank you'. Hand rises to chin, and then moves down and out toward speaker
        const cycle = (Math.sin(t * 3.5) + 1) / 2; // 0 to 1 loop
        
        leftElbow.x = -0.35;
        leftWrist.x = -0.25;
        leftWrist.y = -0.2;

        rightElbow.x = 0.2;
        rightElbow.y = 0.05;

        // From mouth/chin {x: 0, y: 0.45, z: 0.12} to forward {x: 0, y: 0.1, z: 0.25}
        rightWrist.x = 0.15 - cycle * 0.15;
        rightWrist.y = 0.45 - cycle * 0.35;
        rightWrist.z = 0.12 + cycle * 0.18;

        rightHand.x = rightWrist.x;
        rightHand.y = rightWrist.y + 0.02;
        rightHand.z = rightWrist.z;
      }
      else if (gestureType === 'sim') {
        // "SIM": Nod head enthusiastically, hands steady in front
        const nod = Math.sin(t * 6) * 0.05;
        head.y += nod;
        leftEye.y += nod;
        rightEye.y += nod;
        mouthLeft.y += nod;
        mouthRight.y += nod;

        // Hands relaxed in chest area
        leftElbow.x = -0.25; leftWrist.x = -0.15; leftWrist.y = -0.1;
        rightElbow.x = 0.25; rightWrist.x = 0.15; rightWrist.y = -0.1;
      }
      else if (gestureType === 'nao') {
        // "NÃO": shake head side-to-side, wave index finger or hand back and forth
        const shake = Math.sin(t * 6) * 0.06;
        head.x += shake;
        leftEye.x += shake;
        rightEye.x += shake;

        leftElbow.x = -0.32;
        leftWrist.x = -0.22;
        leftWrist.y = -0.15;

        rightElbow.x = 0.25;
        rightElbow.y = 0.08;
        
        // Single finger/hand sway motion
        rightWrist.x = 0.22 + Math.sin(t * 7) * 0.12;
        rightWrist.y = 0.12;
        rightWrist.z = 0.15;
      }
      else if (gestureType === 'surdo') {
        // "SOU SURDO": right hand touches ear, then moves to mouth/chin.
        const cycle = (Math.sin(t * 2.5) + 1) / 2; // osc: 0 to 1

        leftElbow.x = -0.32;
        leftWrist.x = -0.25;
        leftWrist.y = -0.18;

        // Ear coords: {x: 0.11, y: 0.55, z: 0.05}
        // Mouth coords: {x: 0, y: 0.5, z: 0.1}
        rightElbow.x = 0.22; rightElbow.y = 0.2;
        
        rightWrist.x = 0.12 - cycle * 0.12;
        rightWrist.y = 0.54 - cycle * 0.06;
        rightWrist.z = 0.05 + cycle * 0.06;

        rightHand.x = rightWrist.x;
        rightHand.y = rightWrist.y;
        rightHand.z = rightWrist.z;
      }
      else if (gestureType === 'transporte') {
        // "TRANSPORTE": Steering wheel rotation! Left and right hands hold dial and rotate together
        const cycle = Math.sin(t * 4) * 0.12; // tilt angle

        leftElbow.x = -0.2; leftElbow.y = 0.0;
        leftWrist.x = -0.15 - cycle * 0.08;
        leftWrist.y = -0.05 + cycle * 0.08;
        leftWrist.z = 0.25;

        rightElbow.x = 0.2; rightElbow.y = 0.0;
        rightWrist.x = 0.15 - cycle * 0.08;
        rightWrist.y = -0.05 + cycle * 0.08;
        rightWrist.z = 0.25;
      }
      else if (gestureType === 'ola') {
        // "OLÁ / HELLO": Waving right hand up high
        leftElbow.x = -0.32;
        leftWrist.x = -0.22;
        leftWrist.y = -0.1;

        rightElbow.x = 0.35;
        rightElbow.y = 0.32;
        
        rightWrist.x = 0.38 + Math.sin(t * 7.5) * 0.14; // Waving high velocity
        rightWrist.y = 0.45;
        rightWrist.z = 0.12;

        rightHand.x = rightWrist.x;
        rightHand.y = rightWrist.y + 0.03;
        rightHand.z = rightWrist.z;

        // Big friendly head tilt
        head.x = Math.sin(t * 2) * 0.02;
      }
      else {
        // "SPELL" or idle typing feedback spelling action
        const waveLeft = Math.sin(t * 5) * 0.06;
        const waveRight = Math.cos(t * 5) * 0.06;

        leftElbow.x = -0.28; leftElbow.y = 0.05;
        leftWrist.x = -0.2 + waveLeft;
        leftWrist.y = -0.08 + Math.abs(waveLeft);
        leftWrist.z = 0.18;

        rightElbow.x = 0.28; rightElbow.y = 0.05;
        rightWrist.x = 0.2 + waveRight;
        rightWrist.y = -0.08 + Math.abs(waveRight);
        rightWrist.z = 0.18;
      }

      // Projection projection results
      const pWaist = project(waist);
      const pChest = project(chest);
      const pNeck = project(neck);
      const pHead = project(head);

      const pLeftShoulder = project(leftShoulder);
      const pRightShoulder = project(rightShoulder);
      
      const pLeftElbow = project(leftElbow);
      const pRightElbow = project(rightElbow);

      const pLeftWrist = project(leftWrist);
      const pRightWrist = project(rightWrist);

      const pLeftHand = project(leftHand);
      const pRightHand = project(rightHand);

      const pLeftLight = project(headLightLeft);
      const pRightLight = project(headLightRight);

      // Render lights on top of head if SOS or police triggering
      if (gestureType === 'sos' || gestureType === 'policia') {
        const toggleLight = Math.floor(t * 12) % 2 === 0;
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = toggleLight ? '#ef4444' : '#3b82f6';
        
        ctx.fillStyle = toggleLight ? '#ef4444' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(pLeftLight.sx, pLeftLight.sy, 6, 0, Math.PI * 2);
        ctx.arc(pRightLight.sx, pRightLight.sy, 6, 0, Math.PI * 2);
        ctx.fill();

        // Screen flare flashes!
        ctx.shadowBlur = 0;
        ctx.fillStyle = toggleLight ? 'rgba(239, 68, 68, 0.02)' : 'rgba(59, 130, 246, 0.02)';
        ctx.fillRect(0, 0, width, height);
      }

      // Render Joints and Bones connectors
      // 3D holographic style strokes
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw bones
      const drawBone = (p1: any, p2: any, color: string, widthVal: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = widthVal;
        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.stroke();
      };

      // Cyber style coloring
      const mainGold = 'rgba(29, 185, 84, 0.85)'; // Spotify Green / Custom SOS color glow
      const skinWhite = 'rgba(255, 255, 255, 0.9)';
      const accentCyan = '#1DB954';
      const shadowGrey = 'rgba(40,40,40,0.5)';

      // Central backbone / Torso structure
      drawBone(pWaist, pChest, mainGold, 6);
      drawBone(pChest, pNeck, mainGold, 6);
      drawBone(pNeck, pHead, mainGold, 7);
      
      // Shoulders
      drawBone(pLeftShoulder, pRightShoulder, accentCyan, 5);
      drawBone(pChest, pLeftShoulder, mainGold, 4);
      drawBone(pChest, pRightShoulder, mainGold, 4);

      // Arm Left
      drawBone(pLeftShoulder, pLeftElbow, skinWhite, 4.5);
      drawBone(pLeftElbow, pLeftWrist, skinWhite, 3.5);
      drawBone(pLeftWrist, pLeftHand, accentCyan, 2);

      // Arm Right
      drawBone(pRightShoulder, pRightElbow, skinWhite, 4.5);
      drawBone(pRightElbow, pRightWrist, skinWhite, 3.5);
      drawBone(pRightWrist, pRightHand, accentCyan, 2);

      // Draw 3D Spheres on main joints
      const drawJoint = (p: any, size: number, color: string, glow = true) => {
        if (glow) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = color;
        }
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      };

      // Draw robot head sphere
      const headRadius = scaleFactor * 0.11;
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(29, 185, 84, 0.35)';
      ctx.strokeStyle = accentCyan;
      ctx.lineWidth = 3;
      ctx.fillStyle = '#0a0a0a';
      ctx.beginPath();
      ctx.arc(pHead.sx, pHead.sy, headRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw eyes & blinking expressions
      const pLeftEye = project(leftEye);
      const pRightEye = project(rightEye);
      const isBlinking = Math.floor(t * 0.45) % 12 === 0;

      if (isBlinking) {
        // Blind horizontal line
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        
        ctx.beginPath(); ctx.moveTo(pLeftEye.sx - 3, pLeftEye.sy); ctx.lineTo(pLeftEye.sx + 4, pLeftEye.sy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pRightEye.sx - 3, pRightEye.sy); ctx.lineTo(pRightEye.sx + 4, pRightEye.sy); ctx.stroke();
      } else {
        // Bright blue neon circles
        ctx.fillStyle = '#00ffff';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#00ffff';
        ctx.beginPath();
        ctx.arc(pLeftEye.sx, pLeftEye.sy, 2.5, 0, Math.PI * 2);
        ctx.arc(pRightEye.sx, pRightEye.sy, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw mouth expression
      const pMouthLeft = project(mouthLeft);
      const pMouthRight = project(mouthRight);
      const pMouthMid = project(mouthMid);

      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pMouthLeft.sx, pMouthLeft.sy);
      if (gestureType === 'ola' || gestureType === 'obrigado') {
        // Smiling curve
        ctx.quadraticCurveTo(pMouthMid.sx, pMouthMid.sy + 4, pMouthRight.sx, pMouthRight.sy);
      } else {
        // Neutral line
        ctx.lineTo(pMouthRight.sx, pMouthRight.sy);
      }
      ctx.stroke();

      // Render other physical nodes
      drawJoint(pLeftShoulder, 4, accentCyan, false);
      drawJoint(pRightShoulder, 4, accentCyan, false);
      drawJoint(pLeftElbow, 3.5, '#fff', false);
      drawJoint(pRightElbow, 3.5, '#fff', false);
      drawJoint(pLeftWrist, 3, accentCyan);
      drawJoint(pRightWrist, 3, accentCyan);
      drawJoint(pLeftHand, 2, '#fff');
      drawJoint(pRightHand, 2, '#fff');

      // Add a cool cyber scanline grid overlay sweep effect
      const scanY = (t * 50) % height;
      ctx.strokeStyle = 'rgba(29, 185, 84, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(10, scanY);
      ctx.lineTo(width - 10, scanY);
      ctx.stroke();

      // Slow trace auto rotation around the character
      if (isPlaying) {
        currentAutoRotate = Math.sin(t * 0.15) * 0.15;
      }

      // Call next frame
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isPlaying, gestureType, speed, rotationAngle]);

  const handleTogglePlay = () => {
    playFeedback();
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    playFeedback();
    timeRef.current = 0;
  };

  const handleRotateLeft = () => {
    playFeedback();
    setRotationAngle((prev) => prev - 0.4);
  };

  const handleRotateRight = () => {
    playFeedback();
    setRotationAngle((prev) => prev + 0.4);
  };

  return (
    <div className="w-full bg-[#000000] border-3 border-neutral-900 rounded-2xl p-4 flex flex-col space-y-3 relative overflow-hidden shadow-xl">
      {/* 3D Holographic Header details */}
      <div className="flex items-center justify-between text-left select-none relative z-10 border-b border-neutral-900 pb-2">
        <div className="space-y-0.5">
          <span className="text-[9px] font-bold text-[#1DB954] uppercase tracking-widest block font-mono">
            🖥️ VIRTUAL AVATAR 3D
          </span>
          <h4 className="text-sm font-black text-white uppercase tracking-wider">
            {labels.avatarTitle}
          </h4>
        </div>

        {/* Dynamic Activity Tag */}
        <div className="px-2 py-1 rounded bg-neutral-950 border border-neutral-900 flex items-center gap-1.5 text-[9px] font-mono select-none">
          <span className={`w-1.5 h-1.5 rounded-full ${activeGestureName ? 'bg-amber-500 animate-ping' : 'bg-[#1DB954]'}`} />
          <span className="text-zinc-400 uppercase font-bold">
            {activeGestureName ? `${labels.gesturing} ${gestureType.toUpperCase()}` : labels.idleStatus}
          </span>
        </div>
      </div>

      {/* 3D Hologram Canvas Viewer */}
      <div className="w-full h-56 bg-[#000000] rounded-xl relative border border-neutral-950 overflow-hidden flex items-center justify-center">
        
        {/* Futuristic Grid Overlay visual effect */}
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-emerald-950/10 to-transparent pointer-events-none" />

        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-grab active:cursor-grabbing"
          title="Procedural 3D Robot sign interpreter"
        />

        {/* Floating holographic coordinates overlay */}
        <div className="absolute left-3 top-3 text-[8px] font-mono text-emerald-500/60 pointer-events-none text-left">
          <p>MATRIX_FOV: 3.0</p>
          <p>Y_AXIS_ROT: {rotationAngle.toFixed(2)}RAD</p>
          <p>RENDER_ENGINE: CANVAS_3D</p>
        </div>

        {/* Tap instructions */}
        <span className="absolute right-3 bottom-2 text-[8px] font-mono text-zinc-500 uppercase tracking-widest pointer-events-none select-none">
          {labels.description}
        </span>
      </div>

      {/* 3D Avatar Control Panel Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 relative z-10 select-none border-t border-neutral-900">
        
        {/* Play / Pausar / Reiniciar */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleTogglePlay}
            className={`p-2.5 rounded-lg border text-white font-bold transition-transform active:scale-90 cursor-pointer ${
              isPlaying ? 'bg-zinc-900 border-zinc-800' : 'bg-[#1DB954] border-[#1DB954] text-black'
            }`}
            title={isPlaying ? labels.pause : labels.play}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-black" />}
          </button>
          
          <button
            onClick={handleReset}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 hover:border-zinc-700 text-zinc-300 rounded-lg transition-transform active:scale-90 cursor-pointer"
            title={labels.reset}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Rotate Y-axis controls (view changing) */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-zinc-500 font-mono font-bold mr-1 uppercase">{labels.viewAngle}:</span>
          <button
            onClick={handleRotateLeft}
            className="px-2 py-1 bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white rounded text-[10px] uppercase font-bold active:scale-95 cursor-pointer font-mono"
          >
            -45°
          </button>
          <button
            onClick={handleRotateRight}
            className="px-2 py-1 bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white rounded text-[10px] uppercase font-bold active:scale-95 cursor-pointer font-mono"
          >
            +45°
          </button>
        </div>

        {/* Speed Adjustment Sliders */}
        <div className="flex items-center gap-1.5 bg-neutral-950 px-2 py-1 rounded border border-neutral-900">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{labels.speed}:</span>
          <div className="flex gap-1">
            {([0.5, 1, 1.5] as number[]).map((sp) => (
              <button
                key={sp}
                onClick={() => { playFeedback(); setSpeed(sp); }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-tight cursor-pointer ${
                  speed === sp
                    ? 'bg-[#1DB954] text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
