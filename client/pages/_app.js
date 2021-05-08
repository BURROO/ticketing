import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import Header from '../components/Header';


const AppComponent = ({ Component, pageProps, currentUser }) => {

  return (
    <>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </>
  )
};
// From the course:
// Different props provided: context === { Component, ctx: { req, res}}
// AppComponent.getInitialProps = async (appContext) => {
AppComponent.getInitialProps = async (appContext) => {

  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  
  let pageProps = {};

  // Pass down props through getInitialProps
  if(appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    )
  }

  return {
    pageProps,
    ...data
  }
}

export default AppComponent