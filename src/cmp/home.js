import React from 'react';
import moment from 'moment';

import {
  getProcedures,
  getData
} from '../act';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      procedures: [],
      procedure: null,
      data: null,
      geolocation: false,
      position: {
        lat: 0,
        lon: 0
      }
    };
    this.showPosition = this.showPosition.bind(this);
    this.loadList = this.loadList.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount(){
    this.loadList();
    // if (navigator.geolocation) {
    //   navigator.geolocation.watchPosition(this.showPosition);
    //   this.setState({
    //     geolocation: true
    //   })
    // } else { 
    //   this.setState({
    //     geolocation: false
    //   })
    // }
  }

  loadData(procedure) {
    this.setState({
      isFetching: true,
      procedure: procedure
    }, ()=>{
      getData(procedure.name).then((response)=>{
        this.setState({
          isFetching: false,
          data: response.data.data[0]
        });
      })
    })
  }

  loadList(){
    this.setState({
      isFetching: true,
      procedures: [],
      data: null
    }, ()=>{
      getProcedures().then((response)=>{
        this.setState({
          isFetching: false,
          procedures: response.data.data.filter(p => moment(p.samplingTime.endposition).isValid())
        });
      });
    });
  }

  showPosition(position){
    console.log(position.coords);
    this.setState({
      position: {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }
    })
    // x.innerHTML = "Latitude: " + position.coords.latitude + 
    // "<br>Longitude: " + position.coords.longitude;
  }



  render() {
    return (
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            backgroundColor: 'black',
            color: 'white',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              flex: 1,
              padding: '0.5em',
              fontSize: '1.5em',
            }}
          >
            {
              this.state.data === null?
                '4ONSE: (' + this.state.procedures.length + ' stations)':
                this.state.procedure.name
            }
          </div>
          {
            this.state.isFetching === true?
              <div
                style={{
                  padding: '0.2em',
                  marginRight: '1em'
                }}
              >
                Loading...
              </div>:
              this.state.data === null?
                <div
                  onClick={this.loadList}
                  style={{
                    border: 'thin solid white',
                    padding: '0.2em',
                    marginRight: '1em'
                  }}
                >
                  Reload
                </div>:
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <div
                    onClick={()=>{
                      this.setState({
                        data: null
                      })
                    }}
                    style={{
                      border: 'thin solid white',
                      padding: '0.2em',
                      marginRight: '1em'
                    }}
                  >
                    Back to list
                  </div>
                  <div
                    onClick={()=>{
                      this.loadData(this.state.procedure)
                    }}
                    style={{
                      border: 'thin solid white',
                      padding: '0.2em',
                      marginRight: '1em'
                    }}
                  >
                    Reload
                  </div>
                </div>
          }
        </div>
        <div
          style={{
            flex: '1',
            overflowY: 'scroll'
          }}
        >
        {
          this.state.isFetching === true?
            null:
            this.state.data === null?
            <div>
              {
                this.state.procedures.map((procedure, idx)=>(
                  <div
                    key={'pl-'+idx}
                    onClick={()=>{
                      this.loadData(procedure)
                    }}
                    style={{
                      padding: '0.5em',
                      borderBottom: 'thin solid #787878',
                      cursor: 'pointer'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.5em'
                      }}
                    >
                      {procedure.name}
                    </div>
                    <div
                      style={{
                        color: moment(procedure.samplingTime.endposition).isAfter(moment().subtract(1, 'days'))? '#636363': 'red'
                      }}
                    >
                      {
                        moment(procedure.samplingTime.endposition).fromNow()
                      } ({
                        moment(procedure.samplingTime.endposition).format('lll')
                      })
                    </div>
                    <div
                      style={{
                        color: '#636363',
                        fontStyle: 'italic'
                      }}
                    >
                      > {
                        procedure.description
                      }
                    </div>
                  </div>
                ))
              }
            </div>:
            <div>
              <table>
                <tbody>
                {
                  this.state.data.result.DataArray.field.map((field, idx)=>(
                    <tr
                      key={'obs-'+idx}
                    >
                      <td>
                        {field.name}
                      </td>
                      <td
                        style={{
                          textAlign: 'right'
                        }}
                      >
                        {
                          field.name === 'Time'?
                            <div>
                              {moment(this.state.data.result.DataArray.values[0][idx]).format('lll')}
                              <br/>
                              <span
                                style={{
                                  color: '#787878'
                                }}
                              >
                                {moment(this.state.procedure.samplingTime.endposition).fromNow()}
                              </span>
                            </div>:
                            this.state.data.result.DataArray.values[0][idx]
                        } {
                          field.hasOwnProperty('uom')? field.uom: null
                        }
                      </td>
                    </tr>
                  ))
                }
                </tbody>
              </table>
            </div>
        }
        </div>
      </div>
    );
  }
};

export default Home;