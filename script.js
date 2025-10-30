const cityInput=document.querySelector(".city-input");
const searchBtn=document.querySelector(".search-button");
const weatherInfoSection=document.querySelector(".weather-info");
const notFoundsection=document.querySelector(".not-found");
const searchCitySection=document.querySelector(".search-city");
const countryTxt =document.querySelector(".country-txt");
const tempTxt=document.querySelector(".temp-text");
const conditionTxt =document.querySelector(".condition-txt ");
const humidityTxt=document.querySelector(".humidity-value");
const windTxt=document.querySelector(".wind-value");
const weatherSummaryImg=document.querySelector(".weather-summary-img");
const currentDataTxt=document.querySelector(".current-date");
const forecastItemConatiner=document.querySelector(".forcast-item-container");
const icon=document.getElementById("icon");

const apiKey="b68935896127b56ae57369e9631c4cdd";

searchBtn.addEventListener("click",()=>{
    if(cityInput.value.trim() !=''){
        updateWeatherInfo(cityInput.value); 
    console.log(cityInput.value);
    cityInput.value=''
    cityInput.blur();
    }
    else{
       console.log("enter a city name");  
    }
});
cityInput.addEventListener("keydown",(event)=>{
    if(cityInput.value.trim()!=''&& event.key == "Enter"){
          updateWeatherInfo(cityInput.value);
        console.log(cityInput.value);
    cityInput.value=''
    cityInput.blur(); 
    }
   
});

async function getFetchData(endPoint,city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response= await fetch(apiUrl);
    return response.json();
};
function getWeatherIcon(id){
    if(id<=232) return 'thunderstorm.svg'
    if(id<=321) return 'dizzle.svg'
    if(id<=531) return 'rain.svg'
    if(id<=622) return 'snow.svg'
    if(id<=781) return 'atmosphere.svg'
    if(id<=800) return 'clear.svg'
   else return 'clouds.svg'
}

function getCurrentDate(){
    const currentDate = new Date()

    const option={ weekday:'short',
        day:'2-digit',month:'short'
    }

    return currentDate.toLocaleDateString('en-GB',option)
}
async function updateWeatherInfo(city){
    const Weatherdata= await getFetchData('weather',city);
     
      if(Weatherdata.cod=='404'){
        showDispalySection(notFoundsection)
        return
      }
       console.log(Weatherdata);

       const {name:country,
        main:{temp,humidity},
        weather:[{id,main}],
        wind:{speed}


       }=Weatherdata

       countryTxt.textContent = country;
       tempTxt.textContent=Math.round(temp)+'°C';
       humidityTxt.textContent=humidity+'%';
       conditionTxt.textContent=main;
       windTxt.textContent=speed+'km/h';
       currentDataTxt.textContent=getCurrentDate()
       weatherSummaryImg.src=`assets/weather/${getWeatherIcon(id)}`;

       await updateForecastInfo(city)
      showDispalySection(weatherInfoSection);
}

async function updateForecastInfo(city){
const ForecastData=await getFetchData('forecast',city)
const Timetaken='12:00:00';
const todayDate= new Date().toISOString().split('T')[0]

forecastItemConatiner.innerHTML=''

ForecastData.list.forEach(forecastweather=>{
   if(forecastweather.dt_txt.includes(Timetaken) && !forecastweather.dt_txt.includes(todayDate)){
     console.log(forecastweather)
     updateForecastItems(forecastweather)
    }
})
function updateForecastItems(weatherData){
console.log(weatherData);

const {
    dt_txt:date,
    weather:[{id}],
    main:{temp}
}=weatherData

const dateTaken=new Date(date)
const dateOptions={day:'2-digit',
    month:'short'

}
const dateResult=dateTaken.toLocaleDateString('en-US',dateOptions)

const forecastItem =`<div class="forecast-item">
        <h5 class="forecast-item-date  regular-txt">
            ${dateResult}
        </h5>
        <img src="assets/weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
        <h5 class="forecast-item-temp">${Math.round(temp)+'°C'}</h5>
    </div>`
    forecastItemConatiner.insertAdjacentHTML('beforeend',forecastItem)

}
console.log(todayDate)
console.log(ForecastData)
}
function showDispalySection(section){
    [weatherInfoSection,notFoundsection,searchCitySection]
    .forEach(sec =>sec.style.display='none');

    section.style.display='block';
}
icon.onclick =function(){
    document.body.classList.toggle("darktheme");
}


const button=document.querySelector(".btn");

function fetchLocation(position){
console.log(position.coords.latitude);
};

function getLocation() {
 console.log("error");
}


button.addEventListener("click",async ()=>{
    navigator.geolocation.getCurrentPosition( fetchLocation,getLocation);
});