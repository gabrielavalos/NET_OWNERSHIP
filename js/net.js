////////////   TO DO  ///////////////////////////
//  CREATE DROP DOWN FROM JSON FILE HEADER/INDEX
//  ADD CREATE TABLE FUNCTION? PROPERTY SHOULD MATCH VALUES  //////


function createPartnerOptions() {
    var partnerSelector = d3.select("#partner-name"); //SELECT <select> WHERE PARTNER NAMES WILL APPEAR
    d3.json('./static/partner_id.json').then((partners) => { //READ IN JSON FILE COINTAING ALL PARTNER'S NAMES
        //console.log(partners);
        var southTexasPartners = Object.values(partners.partner_name).sort() //EMPTY ARRAY TO CONTAIN ALL PARTNER'S NAME (REPEATED)
        //console.log(southTexasPartners);
        southTexasPartners.forEach((partner) =>{
            //console.log(partner)
            partnerSelector
            .append('option')
            .text(partner)
            .property('Value', partner);
        })
        //document.getElementById("partner-name").size = southTexasPartners.length + 1 //SELECT PARTER <select> AND MAKE IT THE SIZE OF THE LENGTH OF THE PARTNER'S LIST
    })
}; //END OF createOptions()

createPartnerOptions() //CALL FUNCTION TO CREATE PARTNER'S NAME AS SOON AS THE PAGE LOADS



function createCurves(t) {
    var dropdownMenu = document.getElementById("partner-name").selectedOptions; //MAKE SELECTED PARTNER NAME INTO A var
    values = Array.from(dropdownMenu).map(({ value }) => value); //SELECTED PARTNER INTO ARRAY
    console.log(values); //SELECTED PARTNER
   
    //d3.json('./static/ownership-oil.json').then((oilOwnership) => { //READ IN .json CONTAINING PARTNER'S WELL AND INTEREST INFO
    d3.json('./static/Individual_Ownership/'+values+'-ownership.json').then((ownership) => { //READ IN .json CONTAINING PARTNER'S WELL AND INTEREST INFO
        console.log(Object.getOwnPropertyNames(ownership[0]));
        console.log(ownership[0]);
        console.log(typeof ownership[0].Date);

        var dates = [];
        var oil =[];
        var gas = [];

        ownership.forEach((production) =>{
           // dates.push(Date(production.Day));
            dates.push(production.Date);
            oil.push(production.Oil)
            gas.push(production.Gas)
        })

        console.log(dates[0])
        //console.log(typeof new Date(dates[0]))
        //console.log(new Date(dates[0]))
        //console.log(Date.parse(dates[0]))
        //console.log(oil[0])
        //console.log(gas[0])

             // GET DATE FOR NEXT YEAR TO CREATE EXTRA SPACE FOR FORECAST //
        var mostRecentEntry = dates[dates.length-1]; //MOST RECENT DATE WITHOUT HOUR AS VARIABLE
             var mostRecentDate = new Date(mostRecentEntry) //MAKE MOST RECENT ENTRY A DATE 
             var nextYearsDate = new Date(mostRecentDate.setFullYear(mostRecentDate.getFullYear() + 1)); //GET YEAR FROM MOST RECENT DATE AND ADD A YEAR
             var nextYear= nextYearsDate.getFullYear() //GET NEXT YEARS DATE
             var nextMonth= nextYearsDate.getMonth() + 1 // GET NEXTS YEARS MONTH, ADD ONE BECAUSE MONTHS ARE INDEXED AT 0
             var nextDate= nextYearsDate.getDate() //GET NEXT YEARS DATE
             nextYearGraph = `${nextYear}-${nextMonth}-${nextDate}`; // CREATE FULL DATE FOR NEXT YEAR IN RIGHT FORMAT FOR AXIS
             console.log(`${nextYearGraph} is a year from the most recent production date.`);
             
             var dataOil = [{
                 x: dates, //SLICE BASED ON THE SMALLEST INDEX NUMBER CONTAINING THE FIRST NONZERO
                 y: oil,
                 type: "line",
                 line:
                 {color: "green"}
                }
            ];   
             var layoutOil = {
                 title: "Oil BBL",
                 yaxis: {
                     title: "BOPD Net",
                     zeroline: true,
                     showline: true,
                     type: t,
                     gridcolor: '#bdbdbd',
                    //autorange: true
                    },
                 xaxis: {
                    gridcolor: '#bdbdbd',
                    autorange: false,
                    type: 'date',
                    range: [dates[0], nextYearGraph] //365 to only show 1 year back, can make it into a variable, include an Inception button that does it from dates[0]
                    }
                };

                var config = {responsive: true} 

            Plotly.newPlot("oilDeclineCurve", dataOil, layoutOil, config);

            var dataGas = [{
                x: dates,
                y: gas,
                type: "line",
                line:
                    {color: "red"}
                }
            ];
            var layoutGas = {
                title: "Gas MCF",
                yaxis: {
                    title: "MCFD Net",
                    zeroline: true,
                     showline: true,
                     type: t,
                     autorange: true,
                     gridcolor: '#bdbdbd',
                },
                xaxis: {
                    gridcolor: '#bdbdbd',
                   // autorange: false,
                    type: 'date',
                    range: [dates[0], nextYearGraph] //365 to only show 1 year back, can make it into a variable, include an Inception button that does it from dates[0]
                    }
                };

                var config = {responsive: true}

            Plotly.newPlot("gasDeclineCurve", dataGas, layoutGas, config);
        
    })
};



 

d3.select("#partner-name").on('change', function() {createCurves(t="log")}); //WHEN THERE IS A CHANGE IN THE PARTNERS SELECT, CREATE WELL OPTIONS FOR THAT PARTNER LOG
d3.select("#log").on('click', function() {createCurves(t="log")});
d3.select("#linear").on('click', function() {createCurves(t="linear")});

 
