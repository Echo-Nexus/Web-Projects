const Card = ({ name, image, description }) => {
  console.log(image);
  return (
    <div className="card">
      <img src={image} alt="Profile Image" />
      <h1>{name}</h1>
      <p>{description}</p>
      <button>View Profile</button>
    </div>
  );
};

export default Card;
