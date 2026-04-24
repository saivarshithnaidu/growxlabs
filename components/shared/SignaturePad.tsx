"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Eraser, Upload } from 'lucide-react';

interface SignaturePadProps {
  onSign: (signatureDataUrl: string | null) => void;
  label: string;
  disabled?: boolean;
  initialSignature?: string | null;
}

export default function SignaturePad({ onSign, label, disabled = false, initialSignature = null }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [mode, setMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('');
  const [signatureImage, setSignatureImage] = useState<string | null>(initialSignature);

  // Set up canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || disabled) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fix DPI scaling for crisp lines
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const getPos = (e: MouseEvent | TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = ('touches' in e) ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const y = ('touches' in e) ? e.touches[0].clientY : (e as MouseEvent).clientY;
      return { x: x - r.left, y: y - r.top };
    };

    const start = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      setIsDrawing(true);
      setHasDrawn(true);
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    const stop = () => {
      if (isDrawing) {
        setIsDrawing(false);
        onSign(canvas.toDataURL());
      }
    };

    canvas.addEventListener('mousedown', start as any);
    canvas.addEventListener('mousemove', draw as any);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseout', stop);
    
    canvas.addEventListener('touchstart', start as any, { passive: false });
    canvas.addEventListener('touchmove', draw as any, { passive: false });
    canvas.addEventListener('touchend', stop);

    return () => {
      canvas.removeEventListener('mousedown', start as any);
      canvas.removeEventListener('mousemove', draw as any);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('mouseout', stop);
      canvas.removeEventListener('touchstart', start as any);
      canvas.removeEventListener('touchmove', draw as any);
      canvas.removeEventListener('touchend', stop);
    };
  }, [isDrawing, disabled, mode]);

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawn(false);
    setTypedName('');
    setSignatureImage(null);
    onSign(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSignatureImage(dataUrl);
      onSign(dataUrl);
      setMode('upload');
    };
    reader.readAsDataURL(file);
  };

  // If already signed/disabled, show the signature directly
  if (disabled && signatureImage) {
    return (
      <div className="flex flex-col space-y-2">
        <p className="text-[10px] font-black uppercase text-[#0D1B4B]">{label}</p>
        <div className="h-24 flex items-end justify-center border-b-2 border-neutral-900 pb-2">
          <img src={signatureImage} alt="Signature" className="max-h-20 object-contain" />
        </div>
      </div>
    );
  }

  if (disabled && !signatureImage) {
    return (
      <div className="flex flex-col space-y-2">
        <p className="text-[10px] font-black uppercase text-[#0D1B4B]">{label}</p>
        <div className="h-24 border-b-2 border-neutral-200 flex items-end justify-center pb-2 text-neutral-300 italic text-xs">
          Awaiting Signature
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200 print:bg-transparent print:border-none print:p-0">
      <div className="flex justify-between items-center print:hidden">
        <p className="text-xs font-black uppercase text-[#0D1B4B] flex items-center gap-2">
          <Pencil className="w-3 h-3 text-[#00A86B]" /> {label}
        </p>
        <div className="flex gap-2 bg-white rounded-lg p-1 border border-neutral-200 shadow-sm">
          <button type="button" onClick={() => setMode('draw')} className={`text-[10px] px-3 py-1 rounded font-bold transition-all ${mode === 'draw' ? 'bg-[#00A86B] text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>Draw</button>
          <button type="button" onClick={() => setMode('type')} className={`text-[10px] px-3 py-1 rounded font-bold transition-all ${mode === 'type' ? 'bg-[#00A86B] text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>Type</button>
          <button type="button" onClick={() => setMode('upload')} className={`text-[10px] px-3 py-1 rounded font-bold transition-all ${mode === 'upload' ? 'bg-[#00A86B] text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>Upload</button>
        </div>
      </div>

      <div className="relative bg-white rounded-lg border border-neutral-300 overflow-hidden print:border-b-2 print:border-neutral-900 print:rounded-none">
        
        {mode === 'draw' && (
          <div className="relative w-full h-32">
            <canvas ref={canvasRef} className="w-full h-full cursor-crosshair touch-none" />
            {!hasDrawn && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-neutral-300 text-sm italic">
                  Draw your signature here
               </div>
            )}
          </div>
        )}

        {mode === 'type' && (
          <div className="w-full h-32 flex items-center justify-center p-4">
             <input 
               type="text" 
               placeholder="Type your full name" 
               value={typedName}
               onChange={(e) => {
                 setTypedName(e.target.value);
                 // We would ideally render this to a canvas, but for simplicity, we pass the text back 
                 // and the parent can render it using a cursive font.
                 onSign(`typed:${e.target.value}`);
               }}
               className="w-full text-center text-4xl text-neutral-800 outline-none placeholder:text-neutral-200"
               style={{ fontFamily: "'Caveat', cursive" }}
             />
          </div>
        )}

        {mode === 'upload' && (
          <div className="w-full h-32 flex items-center justify-center p-4">
             {signatureImage ? (
                <img src={signatureImage} alt="Uploaded Sig" className="max-h-full object-contain" />
             ) : (
               <label className="flex flex-col items-center gap-2 cursor-pointer text-neutral-400 hover:text-[#00A86B] transition-colors">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs font-bold">Click to upload image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
               </label>
             )}
          </div>
        )}

      </div>

      <div className="flex justify-end print:hidden">
         <button type="button" onClick={clear} className="text-[10px] text-red-500 hover:text-red-600 font-bold flex items-center gap-1">
            <Eraser className="w-3 h-3" /> Clear Signature
         </button>
      </div>
    </div>
  );
}
