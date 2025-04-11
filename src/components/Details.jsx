import { useParams } from 'react-router-dom';

const Details = () => {
  const params = useParams();  // Recupera il parametro id dalla URL

  return (
    <div className="text-center">
      <h1>Sono nella pagina dei Dettagli, il parametro è: {params.id}</h1>
    </div>
  );
};

export default Details;
