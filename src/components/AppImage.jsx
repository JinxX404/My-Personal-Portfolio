import React from 'react';

function Image({
  src,
  alt = "",
  className = "",
  loading = "lazy",
  width,
  height,
  ...props
}) {

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      width={width}
      height={height}
      decoding="async"
      onError={(e) => {
        e.currentTarget.src = "/assets/images/no_image.png"
      }}
    />
  );
}

export default Image;
