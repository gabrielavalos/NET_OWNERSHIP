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
   
    d3.json('./static/ownership-oil.json').then((oilOwnership) => { //READ IN .json CONTAINING PARTNER'S WELL AND INTEREST INFO

        var dates = [];
        var oil =[];
        var gas = [];

        oilOwnership.forEach((oilDay) => { //LOOP THROUGH OIL DATA
            dates.push(oilDay.Date);
            oil.push(oilDay[values]);
        }); //CLOSE OIL LOOP

         d3.json('./static/ownership-gas.json').then((gasOwnership) => { //LOOP THROUGH GAS DATA
            gasOwnership.forEach((gasDay) => { 
                gas.push(gasDay[values]);
            }); //CLOSE GAS LOOP
             
             //FIND THE INDEX OF THE FIRST NON-ZERO NUMBER
             const firstProductionday = (element) => element > 0;
             var oilNonZero = oil.findIndex(firstProductionday);
             var gasNonZero = gas.findIndex(firstProductionday);

             //COMPARE INDEX OF FIRST NONZEROS TO SPLICE AT THE LOWEST(FIRST) ONE
             var nonZero = 0;
             if (oilNonZero < gasNonZero){
                 nonZero = oilNonZero
                } else {nonZero = gasNonZero};

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
                 x: dates.slice(nonZero), //SLICE BASED ON THE SMALLEST INDEX NUMBER CONTAINING THE FIRST NONZERO
                 y: oil.slice(nonZero),
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
                     gridcolor: '#bdbdbd'
                      //autorange: true
                    },
                 xaxis: {
                    gridcolor: '#bdbdbd',
                    autorange: false,
                    type: 'date',
                    range: [dates[nonZero], nextYearGraph] //365 to only show 1 year back, can make it into a variable, include an Inception button that does it from dates[0]
                    }
                };

                var config = {responsive: true} 

            Plotly.newPlot("oilDeclineCurve", dataOil, layoutOil, config);

            var dataGas = [{
                x: dates.slice(nonZero),
                y: gas.slice(nonZero),
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
                     autorange: false,
                     range: [dates[nonZero], nextYearGraph]
                 }
                };

                var config = {responsive: true}

            Plotly.newPlot("gasDeclineCurve", dataGas, layoutGas, config);
        })
    })
};
 

d3.select("#partner-name").on('change', function() {createCurves(t="log")}); //WHEN THERE IS A CHANGE IN THE PARTNERS SELECT, CREATE WELL OPTIONS FOR THAT PARTNER LOG
d3.select("#log").on('click', function() {createCurves(t="log")});
d3.select("#linear").on('click', function() {createCurves(t="linear")});

 
