import React, { useState, useEffect } from 'react';
import CrudService from '../../services/api.service';
import moment from 'moment-timezone';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import './TimeZoneStyle.css';

export const TimeZoneCustom = () => {

    const [ countries, setCountries ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const [ text, setText ] = useState('');
    const [ timeZone, setTimeZone ] = useState([]);
    const [ coincidences, setCoincidences ] = useState([]);

    const [ hours, setHours ] = useState([]);
    const inicialCountries = ["Europe/London", "America/Mexico_City", "Asia/Tokyo"];
    
    useEffect(() => {
        
        const asynCountries = () => {

            try {
    
                setLoading(true);
    
               const loadCountries = async () => {
                    const response =  await CrudService.getAllCountries();
                    setCountries(response.data);
    
                }
                loadCountries();
                initialCountries();
                setLoading(false);
            } catch (error) {
    
                setLoading(false);
                console.log(error);
            }
        }


        asynCountries();
    },[]);



    const initialCountries = async () => {

        setLoading(true);
        let arr = [];
        
        for(let key in inicialCountries){
            
            await fetch( `http://worldtimeapi.org/api/timezone/${inicialCountries[key]}`)

            .then( resp => resp.json() )
            .then( data => {

                arr.push(data);
                
                
            });
        }

        setTimeZone(arr);
        printHoursTimeZoneHandler(arr);
        setLoading(false);


    }




    const onChangeHandler = (text) => {
        let matches = [];

        if(text.length > 0){
            matches = countries.filter( countrie => {

                const regex = new RegExp(`${text}`,'g');
                return countrie.match(regex);
            })
        }
        setCoincidences(matches)
        setText(text)
    }

    const inputToUppercase = e => {

        e.target.value = ("" + e.target.value).charAt(0).toUpperCase() + e.target.value.substr(1);
    };

    const onCoincidenceHandler = (text) => {
        setText(text);
        setCoincidences([]);
        getTimeZoneHandler(text);
    }

    const getTimeZoneHandler = (text) => {
        const loadTimeZoneCountrie = async () => {
            const timeZoneCountrie =  await CrudService.getTimeZoneCountrie(text);
            setTimeZone([
                ...timeZone,
                timeZoneCountrie.data,
            ])
            printHoursTimeZoneHandler(timeZoneCountrie.data);
        }
        loadTimeZoneCountrie();

    }

    const removeCountryListHandler = (items,i) => {

        let country = [...timeZone];

        if (i !== -1) {
          country.splice(i, 1);
          setTimeZone(country);
        }

        let active_hours = hours.filter((active) =>{
            return active.time_zone !== items.timezone
        });

        setHours(active_hours);

    }

    const timeZoneFormatHandler = (datetime, timezone) => {

        let time = moment(datetime).tz(timezone).format("h:mm:ss a");

        return time;

    };

    const dateZoneFormatHandler = (datetime, timezone) => {

        let date = moment(datetime).tz(timezone).format("ddd, MMMM Do YYYY");

        return date;
    }

    const printHoursTimeZoneHandler = (params) => {

        let hours_country = [];
        let arr_hours = {};
        

        if( Array.isArray(params) ){



            for (let hour = 1; hour < 72; hour++) {

                for (let index = 0; index < params.length; index++) {
                    
                    arr_hours = {
        
                        abbreviation : params[index].abbreviation,
                        time_zone : params[index].timezone,
                        hour : moment(params[index].datetime).add(hour, 'h').tz(params[index].timezone).format("h a"),
                        date : moment(params[index].datetime).add(hour, 'h').tz(params[index].timezone).format("ddd, MMMM Do YYYY")
        
                    }
        
                    hours_country.push( arr_hours );

                }
    
            }
    
            let con = hours_country.concat(hours);
            let update_country = con.filter((item, pos) => con.indexOf(item) === pos);
    
            setHours([
                ...update_country
            ]);

        }else{
            for (let hour = 1; hour < 72; hour++) {

                arr_hours = {
    
                    abbreviation : params.abbreviation,
                    time_zone : params.timezone,
                    hour : moment(params.datetime).add(hour, 'h').tz(params.timezone).format("h a"),
                    date : moment(params.datetime).add(hour, 'h').tz(params.timezone).format("ddd, MMMM Do YYYY")
    
                }
                hours_country.push( arr_hours );
    
    
            }
    
            let con = hours_country.concat(hours);
            let update_country = con.filter((item, pos) => con.indexOf(item) === pos);
    
            setHours([
                ...update_country
            ]);
        }


    }

    return (
        <React.StrictMode>
            <div>
                <h1>WorldtimeLite</h1>
                <hr />

                {

                    loading
                    ?
                    (
                        <div className="alert alert-info text-center">
                            Loading...
                        </div>
                    )
                    :
                    (

                        <div className="row">
                            <div className="col-4">
                                <input
                                    type="text" className="col-4 form-control form-rounded input-search"
                                    id="world-timezone-autocomplete"
                                    placeholder="Find country - Press keyboard letter and Select to Country..."
                                    onChange={ e => onChangeHandler(e.target.value) }
                                    onKeyPress={ inputToUppercase }
                                    value={ text }
                                    onBlur={()=>{
                                        setTimeout(() => {
                                            setCoincidences([])
                                        }, 100);
                                    }}
                                />
                            </div>
                        </div>

                    )
                }

                {
                    coincidences && coincidences.map((coincidences, i) =>
                        <div key={i} id="coincidences" className='coincidence border-0'
                            onClick={ () => onCoincidenceHandler(coincidences) }>
                            { coincidences }
                        </div>
                    )
                }

                <hr />

                {
                    
                    timeZone && timeZone.map( (items, i) =>(

                        <div key={i} id='time-zone-card' className='card card-stile' >

                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-1">

                                            <button type="button" id='remove-item' className="btn btn-light"

                                                onClick={() => removeCountryListHandler(items,i) }
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>

                                        </div>
                                        <div className="col">
                                            <h5 className="card-title">{ items.timezone }</h5>
                                            <h6 className='card-subtitle text-muted'> {  timeZoneFormatHandler(items.datetime, items.timezone) } { items.abbreviation }</h6>
                                            <p className='card-text'>
                                            { dateZoneFormatHandler(items.datetime, items.timezone) }
                                            </p>
                                        </div>

                                        {
                                            
                                            <div className="col-8">
                                                <ScrollMenu 
                                                    key={i}
                                                >

                                                {
                                                hours.filter(elements => (elements.time_zone === timeZone[i].timezone)).map((filteredTimeZone, j) => (

                                                    <div key={j} className="p-2 bd-highlight element-box time-zone-country">
                                                        <div className="card-body">
                                                            <h5 className="card-title">{ filteredTimeZone.hour }</h5>
                                                            <p className="card-text">{ filteredTimeZone.date }</p>
                                                        </div>
                                                    </div>

                                                    ))
                                                }


                                                </ScrollMenu>

                                            </div>
                                        }

                                    </div>

                                </div>
                        </div>
                    ))
                    
                }

                {/* { JSON.stringify(timeZone) } */}

            </div>
        </React.StrictMode>
    )
}
export default TimeZoneCustom;




