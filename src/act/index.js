import axios from 'axios';

export function getProcedures(){
  return axios.get('/4onse/wa/istsos/services/lka/procedures/operations/getlist');
  // return axios.get(process.env.PUBLIC_URL + '/4onse/wa/istsos/services/lka/procedures/operations/getlist');
};

export function getData(name){
  return axios.get(
    '/4onse/wa/istsos/services/lka/operations/getobservation/offerings/temporary/procedures/' + name
    + '/observedproperties/:/eventtime/last'
  );
  // return axios.get(
  //   process.env.PUBLIC_URL
  //   + '/4onse/wa/istsos/services/lka/operations/getobservation/offerings/temporary/procedures/' + name
  //   + '/observedproperties/:/eventtime/last'
  // );
};
