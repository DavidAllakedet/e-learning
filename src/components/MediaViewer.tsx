// d:\PROJETS\COURS REACT\e-l\my-react-app\src\components\MediaViewer.tsx
import React from 'react';

interface MediaViewerProps {
  url: string;
  type: 'video' | 'pdf';
}

const MediaViewer: React.FC<MediaViewerProps> = ({ url, type }) => {
  if (type === 'video') {
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black">
        <video 
          src={url} 
          controls 
          className="w-full h-full"
          controlsList="nodownload"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-slate-200">
      <iframe 
        src={`${url}#toolbar=0`} 
        className="w-full h-full"
        title="PDF Viewer"
      />
    </div>
  );
};

export default MediaViewer;