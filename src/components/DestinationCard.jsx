function DestinationCard({ destination }) {
  return (
    <div className="card">
      <img src={destination.image} alt={destination.name} />

      <div className="card-body">
        <h3>{destination.name}</h3>
        <p>{destination.description}</p>
      </div>
    </div>
  );
}

export default DestinationCard;