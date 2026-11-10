// Created inside the tap handler. Mobile Safari only allows autoplay
// while that user gesture is still on the stack, so this must stay synchronous.

export type SingAlongFrame = {
  id: string;
  src: string;
  title: string;
  allow: string;
  className: string;
  referrerPolicy: string;
  allowFullscreen: boolean;
};

const ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

export function singAlongEmbedSrc(videoId: string, origin: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    playsinline: "1",
    rel: "0",
    enablejsapi: "1",
    origin,
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

/** Insert the nocookie player immediately. Call this from the click handler, not an effect. */
export function startSingAlongFromTap<T extends SingAlongFrame>(
  host: {
    replaceChildren(node: T): void;
    ownerDocument: { createElement(tag: "iframe"): T };
  },
  videoId: string,
  title: string,
  origin: string,
): T {
  const iframe = host.ownerDocument.createElement("iframe");
  iframe.id = "sing-along-player";
  iframe.className = "h-full w-full";
  iframe.src = singAlongEmbedSrc(videoId, origin);
  iframe.title = `${title} sing-along video`;
  iframe.allow = ALLOW;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allowFullscreen = true;
  host.replaceChildren(iframe);
  return iframe;
}
