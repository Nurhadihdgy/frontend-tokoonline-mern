import React from 'react';

export default function ImagePlaceholder({ 
  src, 
  alt, 
  className, 
  size = 'medium'
}) {
  const handleError = (e) => {
    e.target.onerror = null;
    // Replace with a placeholder div when image fails to load
    const wrapper = e.target.parentNode;
    const placeholderDiv = document.createElement('div');
    placeholderDiv.className = `${e.target.className} flex items-center justify-center bg-gray-700`;
    placeholderDiv.innerHTML = `
      <svg class="w-1/3 h-1/3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    `;
    wrapper.replaceChild(placeholderDiv, e.target);
  };

  // If src is null or undefined, show placeholder div directly
  if (!src) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-700`}>
        <svg className="w-1/3 h-1/3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
