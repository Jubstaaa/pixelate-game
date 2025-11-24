import React from "react";

export function addImageResizeParams(imageUrl, width, height) {
  try {
    let url;
    if (imageUrl.startsWith("/")) {
      url = new URL(imageUrl, "http://dummy-base");
    } else {
      url = new URL(imageUrl);
    }
    url.searchParams.set("width", width.toString());
    url.searchParams.set("height", height.toString());
    url.searchParams.set("quality", "75");
    url.searchParams.set("resize", "contain");
    // For relative urls, strip out the origin
    if (imageUrl.startsWith("/")) {
      return url.pathname + url.search;
    }
    return url.toString();
  } catch {
    return imageUrl;
  }
}

function Image({ src, width = 400, height = 400, alt, priority, ...props }) {
  const resizedSrc = addImageResizeParams(src, width, height);

  return (
    <img
      src={resizedSrc}
      alt={alt}
      loading={priority ? "eager" : props.loading}
      fetchPriority={priority ? "high" : "auto"}
      {...props}
    />
  );
}

export default Image;
