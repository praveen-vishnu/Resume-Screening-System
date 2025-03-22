// withDataFetching.tsx
import React, { useEffect, useState } from 'react';

const withDataFetching = (WrappedComponent: React.FC, apiFunc: () => Promise<any>) => {
  return (props: any) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      apiFunc().then((data) => {
        setData(data);
        setLoading(false);
      });
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent data={data} {...props} />;
  };
};

export default withDataFetching;
