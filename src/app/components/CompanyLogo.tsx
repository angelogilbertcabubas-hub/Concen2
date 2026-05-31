import React from 'react';
// IMPORT FIX: Update this line to make sure you are targeting the new filename
import brandLogo from '../../../concen2logo.png'; 

export default function CompanyLogo({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center justify-center select-none overflow-hidden rounded-full`}>
      <img 
        src={brandLogo} 
        alt="ConcenTwo Logo" 
        /* MODIFICATION: We now use object-contain (instead of object-cover)
         and have removed the scale-[1.04] trick. Since the image is already
         circular and transparent, standard containment ensures it fits 
         perfectly without clipping any edge pixels.
        */
        className="w-full h-full object-contain"
      />
    </div>
  );
}