import React, { useState, useEffect, Fragment } from "react";
import "./dashboard.css";
import "../appointmentsEntry/appointmentsEntry.css";
import { db, auth } from '../firebase/firebase'
import { Link, useHistory } from 'react-router-dom'
import Button from '../button'
import Popup from "reactjs-popup";
import BookTaxi from '../BookTaxi/BookTaxi'

function DashboardNoAppoin() {


  let [hospital, setHospital] = useState([])
  let [appointments, setAppointments] = useState([])
  let [chosenOption, setChosenOption] = useState({})
  let [checkUserAppointments, setCheckUserAppointments] = useState(false)
  let [userName, setUserName] = useState('')
  let [userAppointmentsDetails, setUserAppointmentsDetails] = useState([])

  let src = ""

  function handleChange(e) {
    setChosenOption(e.target.value)
    localStorage.setItem('hospital', e.target.value);
  }



  function setlocalStorage(appointmentID) {
    localStorage.setItem('appointmentId', (appointmentID));
  }


  function deleteAppointment(e) {
    console.log(e.target.id)
    var appId = e.target.id;
    db.collection('Appointments').doc(appId).update({
      userID: null
    })


  }
  const history = useHistory();


  const setHospitalNames = () => {
    console.log("unning set hospitals")
    db.collection('Hospitals').get().then((hopsitals) => {
      const hospitalsNames = hopsitals.docs.map(hospitalDetails => {
        return hospitalDetails.data().hospitalName
      })
      setHospital(hospitalsNames)
    })
  }

  useEffect(() => {
    //FIXME: this donest need to run if you dont have an appointment - this filters offered appoitnemnts


    console.log("are we looping like crazy? dash2")

    const today = Date.now() / 1000

    const filteredQuery = db.collection('Appointments').where('userID', '==', null).where('hospitalName', '==', chosenOption)


    filteredQuery.get()
      .then(querySnapshot => {
        const Appointments = []
        querySnapshot.docs.forEach(hospitalAppointments => {
          let app = hospitalAppointments.data().timestamp.seconds
          if (app > today) {
            let currentID = hospitalAppointments.id
            let appObj = { ...hospitalAppointments.data(), ['id']: currentID }
            Appointments.push(appObj)
          }
        })
        Appointments.sort(function (b, a) {
          a = new Date(a.timestamp.seconds);
          b = new Date(b.timestamp.seconds);
          return a > b ? -1 : a < b ? 1 : 0;
        })
        console.log("APPS", Appointments)
        setAppointments(Appointments)
      })
      .catch(error => {
        // Catch errors
      });

  }, [chosenOption])



  useEffect(() => {

    //redirect user to login screen if he is not logged in 
    if (!localStorage.getItem('userid'))
      history.push('/login')

    //FIXME: needs to run everytime to check if we have appiitnments or not.


    console.log("are we looping like crazy? dash3")

    //get currently logged in user
    auth.onAuthStateChanged(async user => {
      if (user) {
        const userData = await db.collection('users').doc(user.uid).get()
        setUserName(userData.data().name)

        userData.data().gender ? localStorage.setItem('gender', userData.data().gender) : localStorage.setItem('gender', 'unkown');


        //get appointments for that user, if any
        db.collection('Appointments').where('userID', '==', user.uid).onSnapshot(snapShot => {

          //if non exist
          if (snapShot.empty) {


            //change state to false - show no appointment screen
            setCheckUserAppointments(false);
            console.log("User doesn't have any Appointment")
            //set names for drop down
            setHospitalNames()


          } // if user has appointments
          else {


            const appointmentsDetails = []
            //map appointments if not historic
            snapShot.docs.map(userAppointments => {
              let app = userAppointments.data().timestamp.seconds
              const today = Date.now() / 1000
              if (app > today) {
                let currentID = userAppointments.id
                let appObj = { ...userAppointments.data(), ['id']: currentID }
                appointmentsDetails.push(appObj)
                setUserAppointmentsDetails(appointmentsDetails)
                console.log("FUTURE user appointments found")
                //set local storag for later pages (taxi booking)
                localStorage.setItem('hospital', appointmentsDetails[0].hospitalName)
                localStorage.setItem('appointmentDate', appointmentsDetails[0].date)
                localStorage.setItem('appointmentTime', appointmentsDetails[0].time)
                localStorage.setItem('appointmentID', currentID)
              }



            })

            //if none of the appointments found were in the future, set up page for book new appointment
            if (!appointmentsDetails.length) {
              console.log("User doesn't have any FUTURE Appointment")
              setCheckUserAppointments(false);
              setHospitalNames()

            } else {
              setCheckUserAppointments(true);
              console.log("User has appointments")

            }

          }

        })

      }

    })


  }, [])


  return (
    <div className="dashboardView mt-3">
      {checkUserAppointments ? (
        <Fragment>
          <div id="introSpan" className="introSpan">Hello <b>{userName}</b>, So far you have donated X times. Wow! That’s wonderful.</div>
          <div className="lineUnderSpan"></div>
          <div className="userEligibility my-3">
            You are <b style={{ color: "green" }}> eligible </b> to donate.
      <br />
            <br />
      Here is few details regarding your upcoming appointment
    </div>
          <table className="schedulesTables">
            <tr className="headerRow">
              <th className="headerEntries">Date</th>
              <th className="headerEntries">Time</th>
              <th className="headerEntries">Location</th>
              <th className="headerEntries"></th>
            </tr>

            {userAppointmentsDetails.map(appointment => (
              <tr className='rowContainer' id={appointment.id}>
                <td className='rowClass' >{appointment.date}</td>
                <td className='rowClass'>{appointment.time}</td>
                <td className='rowClass'>{appointment.hospitalName}</td>
                <div className='btnContainer'>
                  <button onClick={deleteAppointment} id={appointment.id} className="cancelButton">Cancel</button>
                </div>
              </tr>))}



          </table>
          <div className="bottomButtons">
            <a target="_blank"
              href={`https://www.google.com/maps/search/?api=1&query=${localStorage.getItem('hospital')}%hospital`}
            ><Button type="button" text="Get Directions" width="150px">
              </Button></a>
            <Popup trigger={<Button type="button" text="I Need A Ride" color='#C71585' width="150px"></Button>} modal position="left top" closeOnDocumentClick>
              {close => <BookTaxi close={close} />}
            </Popup>

          </div>





        </Fragment>

        //no appointments
      ) : (

          <Fragment>

            <div id="introSpan" className="introSpan">Hello <b>{userName}</b>, So far you have donated X times. Wow! That’s wonderful.</div>

            <div className="lineUnderSpan"></div>

            <div className="userEligibility my-3">
              You are <b style={{ color: "green" }}> eligible </b> to donate.
      <br />
              <br />
      Please, schedule a new appointment:
    </div>

            <p className="hospitalsOptionsContainer mt-3">
              Nearest hospital is{" "}

              <select className="hospitalsOptionsList" onChange={handleChange}>

                <option value="Select" disabled selected>Select</option>

                {hospital.map(name => (

                  <option value={name}>

                    {name}

                  </option>

                ))}



              </select>
            </p>

            <table className="schedulesTables">
              <tr className="headerRow">
                <th className="headerEntries">Date</th>
                <th className="headerEntries">Time</th>
                <th className="headerEntries"></th>
              </tr>

              {appointments.map(appointment => (

                <tr className='rowContainer' id={appointment.id}>
                  <td className='rowClass' >{appointment.date}</td>
                  <td className='rowClass'>{appointment.time}</td>
                  <Link to='/questions'>
                    <td className='rowClass'>
                      <button onClick={() => setlocalStorage(appointment.id)} id={appointment.id} className="registerButton">Register</button>
                    </td>
                  </Link>
                </tr>


              ))}


            </table>

          </Fragment>

        )
      }

    </div>
  );
}


export default DashboardNoAppoin;
