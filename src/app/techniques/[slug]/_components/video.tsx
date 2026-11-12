type Props = {
  url: string;
  title: string;
};

function youtubeId(url: string): string | undefined {
  const match = /(?:youtu\.be\/|v=|embed\/)([\w-]{11})/.exec(url);
  return match?.[1];
}

/** Видео только встраиваем с YouTube, сами не хостим (бриф, стр. 4). */
export function Video({ url, title }: Props) {
  const id = youtubeId(url);
  if (!id) {
    return null;
  }
  return (
    <div
      className="
        aspect-video overflow-hidden rounded-lg
        print:hidden
      "
    >
      {/* Плеер YouTube не работает в sandbox без allow-scripts + allow-same-origin, а такая пара
          ничего не ограничивает. Источник — только youtube-nocookie.com. */}
      {/* eslint-disable-next-line @eslint-react/dom-no-missing-iframe-sandbox */}
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="encrypted-media; picture-in-picture"
        allowFullScreen
        className="size-full"
      />
    </div>
  );
}
