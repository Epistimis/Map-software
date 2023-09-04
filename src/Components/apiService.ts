import { useState, useEffect } from 'react';
import axios from 'axios';

interface LawDetails {
  law: string;
  lawLink: string;
  regulator: string;
  description: string;
}

interface CountryLaw {
  [country: string]: LawDetails;
}

const ApiService = () => {
  const [data, setData] = useState<CountryLaw[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    axios
      .get<CountryLaw[]>("http://localhost:5001/api/privacylaws")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
};

export default ApiService;








