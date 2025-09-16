interface MapTitleProps {
  title?: string;
}

export default function MapTitle({
  title = "Curry County Proposed Timber Lease",
}: MapTitleProps) {
  return (
    <div className="map-title">
      <div className="map-title-text">{title}</div>
    </div>
  );
}
