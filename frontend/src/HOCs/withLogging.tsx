import React, { useEffect, ComponentType } from 'react';

const withLogging = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return (props: P) => {
    useEffect(() => {
      console.log(`Component ${WrappedComponent.name} mounted`);
      return () => console.log(`Component ${WrappedComponent.name} unmounted`);
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withLogging;
