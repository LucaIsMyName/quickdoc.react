import React from 'react';

interface IFrameProps {
  src: string;
  aspect?: '16/9' | '4/3' | '1/1' | '21/9';
  loading?: 'lazy' | 'eager';
  title?: string;
  allow?: string;
}

export const IFrame: React.FC<IFrameProps> = ({
  src,
  aspect = '16/9',
  loading = 'lazy',
  title = 'Embedded content',
  allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
}) => {
  const aspectRatioMap = {
    '16/9': 'pb-[56.25%]', // 9/16 = 0.5625
    '4/3': 'pb-[75%]',     // 3/4 = 0.75
    '1/1': 'pb-[100%]',    // 1/1 = 1
    '21/9': 'pb-[42.86%]', // 9/21 = 0.4286
  };

  return (
    <div className="my-6 w-full">
      <div className={`relative w-full ${aspectRatioMap[aspect]}`}>
        <iframe
          src={src}
          title={title}
          loading={loading}
          allow={allow}
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0 theme-border-radius shadow-lg"
        />
      </div>
    </div>
  );
};
