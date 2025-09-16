interface MapTitleProps {
  title?: string;
}

export default function MapTitle({ title = "NAIC Townships" }: MapTitleProps) {
  return (
    <div className="map-title">
      <div className="map-title-text">{title}</div>
    </div>
  );
}
