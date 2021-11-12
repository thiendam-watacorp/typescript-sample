import React from 'react';
import '../app/views/scss/style.scss';

const App = (props: any) => {
  const { Component, pageProps } = props;
  return <Component {...pageProps} />;
};

export default App;
