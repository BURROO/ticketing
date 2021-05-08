import axios from 'axios';

export default ({ req }) => {
  // Anleitung vom Kurs
  // ServerSideProps wird immer auf dem Server ausgeführt, 
  // daher ist if statment für index.js möglicherweise nicht mehr nötig

  if(typeof window === 'undefined'){
    // We are on the server

    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers // include cookie etc …
    });

  } else {
    // We are on the browser
    return axios.create({
      baseURL: '' // Headers already included in the browser
    });

  }
}

// ,
// {
//   headers: req.headers // include cookie etc …
// }