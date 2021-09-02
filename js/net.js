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



function createCurves() {
    var dropdownMenu = document.getElementById("partner-name").selectedOptions; //MAKE SELECTED PARTNER NAME INTO A var
    values = Array.from(dropdownMenu).map(({ value }) => value); //SELECTED PARTNER INTO ARRAY
    console.log(values); //SELECTED PARTNER
   
    d3.json('./static/ownership-oil.json').then((oilOwnership) => { //READ IN .json CONTAINING PARTNER'S WELL AND INTEREST INFO
       // console.log(Object.getOwnPropertyNames(oilOwnership[0]));
       
        var dates = [];
        var oil =[];
        var gas = [];

        oilOwnership.forEach((oilDay) => { //LOOP THROUGH DATA -> oilDay IS EACH ROW IN THE DATA SET
            dates.push(oilDay.Date);
            oil.push(oilDay[values]);
        }); //CLOSE interest LOOP

         //console.log(dates)
         //console.log(oil)

         d3.json('./static/ownership-gas.json').then((gasOwnership) => {
             
          
            gasOwnership.forEach((gasDay) => { //LOOP THROUGH  ROW OF DATA (interest)
                gas.push(gasDay[values]);
              
            }); //CLOSE interest LOOP
             
             //FIND THE INDEX OF THE FIRST NON-ZERO NUMBER
             const firstProductionday = (element) => element > 0;
             var oilNonZero = oil.findIndex(firstProductionday);
             var gasNonZero = gas.findIndex(firstProductionday);
             //console.log(oilNonZero);
             //console.log(gasNonZero)

             //COMPARING INDEX OF FIRST NONZEROS TO SPLICE AT THE LOWEST ONE
             var nonZero = 0;
             if (oilNonZero < gasNonZero){
                 nonZero = oilNonZero
                } else {nonZero = gasNonZero};
                

             // GETTING DATE FOR NEXT YEAR SO WE CAN HAVE EXTRA SPACE TO FORECAST //
             var mostRecentEntry = dates[dates.length-1]; //MOST RECENT DATE WITHOUT HOUR AS VARIABLE
             var mostRecentDate = new Date(mostRecentEntry) //MAKE MOST RECENT ENTRY A DATE 
             var nextYearsDate = new Date(mostRecentDate.setFullYear(mostRecentDate.getFullYear() + 1)); //GET YEAR FROM MOST RECENT DATE AND ADD A YEAR
             var nextYear= nextYearsDate.getFullYear() //GET NEXT YEARS DATE
             var nextMonth= nextYearsDate.getMonth() + 1 // GET NEXTS YEARS MONTH, ADD ONE BECAUSE MONTHS ARE INDEXED AT 0
             var nextDate= nextYearsDate.getDate() //GET NEXT YEARS DATE
             nextYearGraph = `${nextYear}-${nextMonth}-${nextDate}`; // CREATE FULL DATE FOR NEXT YEAR IN RIGHT FORMAT FOR AXIS
             console.log(`${nextYearGraph} is a year from the most recent production date.`);
             
             var dataOil = [{
                 x: dates.slice(nonZero), //SLICE HERE BASED ON THE SMALLES INDEX NUMBER
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
                     type: 'log',
                      //autorange: true
                    },
                 xaxis: {
                     //autorange: false,
                     range: [dates.slice(nonZero), nextYearGraph] //365 to only show 1 year back, can make it into a variable, include an Inception button that does it from dates[0]
                   
                    }
                };
            Plotly.newPlot("oilDeclineCurve", dataOil, layoutOil);

            var dataGas = [{
                x: dates.slice(nonZero),
                y: gas.slice(nonZero),
                type: "line",
                line:
                    {color: "red"}
                }
            ];
            var layoutGas = {
                title: "Gas BBL",
                yaxis: {
                    title: "MCFD Net",
                    zeroline: true,
                     showline: true,
                     type: 'log',
                     autorange: true
                },
                 xaxis: {
                      //autorange: false,
                     range: [dates.slice(nonZero), nextYearGraph]
                 }
                };
            Plotly.newPlot("gasDeclineCurve", dataGas, layoutGas);

        }
        )
    }
        )
    }
    //document.getElementById("partner-name").addEventListener("change", clearCurves) //WHEN THE SELECTION ON PARTNERS CHANGES, CLEAR OUT THE CURVES
// });
; //END OF createOptions() 



d3.select("#partner-name").on('change', createCurves); //WHEN THERE IS A CHANGE IN THE PARTNERS SELECT, CREATE WELL OPTIONS FOR THAT PARTNER


 
