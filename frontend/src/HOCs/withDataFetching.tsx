import React, { useEffect, useState } from 'react';

interface WithDataFetchingProps {
  data: any[];
}

const withDataFetching = (WrappedComponent: React.FC<WithDataFetchingProps>, fetchData: () => Promise<any[]>) => {
  return (props: any) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchDataAsync = async () => {
        console.log('Fetching data...');

        try {
          const result = await fetchData();
          setData(result);
        } catch (error) {
          setError('Error fetching data');
        } finally {
          setLoading(false);
        }
      };

      fetchDataAsync();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return <WrappedComponent data={data} {...props} />;
  };
};

export default withDataFetching;