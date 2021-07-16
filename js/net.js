function createPartnerOptions() {
    var partnerSelector = d3.select("#partner-name"); //SELECT <select> WHERE PARTNER NAMES WILL APPEAR

    d3.json('./static/south_texas_nets.json').then((partnerOptions) => { //READ IN JSON FILE COINTAING ALL PARTNER'S NAMES
        southTexasPartners = [] //EMPTY ARRAY TO CONTAIN ALL PARTNER'S NAME (REPEATED)
        partnerOptions.forEach((partner) => { //LOOP THROUGH NET_INTEREST FILE
            southTexasPartners.push(partner[1]) //PUSH ALL PARTNER'S NAME TO LIST 
        });
        partners = [...new Set(southTexasPartners)].sort()
        //console.log(partners);
        partners.forEach((partner) => {
            partnerSelector
            .append('option')
            .text(partner)
            .property('Value', partner);
        })
        document.getElementById("partner-name").size = partners.length + 1 //SELECT PARTER <select> AND MAKE IT THE SIZE OF THE LENGTH OF THE PARTNER'S LIST 
    })
        
    }; //END OF createOptions() 

createPartnerOptions() //CALL FUNCTION TO CREATE PARTNER'S NAME AS SOON AS THE PAGE LOADS



function createWellOptions() {
    var wellSelector = d3.select("#well-options"); //SELECT THE "well-options" <select>
    wellPartnerInterest = []; //PARTNER'S INTERESTS
    var dropdownMenu = document.getElementById("partner-name").selectedOptions; //MAKE SELECTED PARTNER NAME INTO A var
    values = Array.from(dropdownMenu).map(({ value }) => value); //SELECTED PARTNER INTO ARRAY
    console.log(values); //SELECTED PARTNER 
    wellOptions = {}; //CONTAINS WELL_ID: WELL_NAME
    interestDataRelevantToPartner = []
    wellIntersts = {}

    
    d3.json('./static/south_texas_nets.json').then((well) => { //READ IN .json CONTAINING PARTNER'S WELL AND INTEREST INFO
        well.forEach((interest) => { //LOOP THROUGH  ROW OF DATA (interest)
            if (values.includes(interest[1])) {
                interestDataRelevantToPartner.push(interest); //IF THE PARTNER SELECTED (values) HAS THE NAME OF THE PARTNER LOCATED AT INDEX 3, THEN..
                wellOptions[interest[2]] = interest[3]; //WELL_ID:WELL_NAME
                wellIntersts[interest[2]] = interest[6]; //WELL_ID:WELL_INTEREST
            };
        }); //CLOSE interest LOOP
        Object.values(wellOptions).forEach(function(value) { //LOOP THROUGH WELL_ID:WELL_NAME VALUES TO APPEND WELL NAME TO "well-options" (wells partner in)
            //console.log(value);
            wellSelector //APPEND WELL_NAME TO well-options <select>
            .append('option')
            .text(value)
            .property('Value', value);
        }); //END VALUES INTERATION
        document.getElementById("well-options").size = partners.length + 1 ////SET THE SIZE OF THE well-options <select> TO THE LEGTH OF THE wellOptions VALUE length
        //console.log(interestDataRelevantToPartner)
        //console.log(wellOptions);
        //console.log(wellIntersts);
    // });
        
newData = [] //PRODUCTION DATA ONLY RELEVANT TO SELECTED PARTNER
netOilProductionForWell = []; //CONTAINS EACH WELLS DAILY OIL NET PRODUCTION OWNED 
allOilNetsAdded = []; //COINTAINS DAILY OIL SUM 
netGasProductionForWell = []; //CONTAINS EACH WELLS DAILY GAS NET PRODUCTION OWNED 
allGasNetsAdded = []; //COINTAINS DAILY GAS SUM 
all_dates = []
console.log(wellIntersts);

//CREATING PRODUCTION DATA SET RELEVANT TO SELECTED PARTNER (COINTAINS DATA ONLY FOR THE WELLS THEY ARE IN)
{d3.json("./static/production_data.json").then((data) =>{
    data.forEach((site) => 
    {if(wellIntersts.hasOwnProperty(site[0]))
        {newData.push(site);
        all_dates.push(site[2])
    }}
    );
   // console.log(newData); //CHECK THAT ONLY THEIR RELEVANT DATA IS BEING STORED IN newData
   // console.log("all_dates", all_dates)

    

    //FOR EACH POINT IN new_data, x[0] HAS THE WELL NAME FROM  partnersWellAndInterest (THE OBJECT CONTAINING wellName:wellInterest), THEN netOilProductionForWell = THE production  x[2] * partnersInterest[x[0]] (property name [WELL NAME][0]), WHICH IS THE INTEREST FOR THAT WELL 
    newData.forEach((x) => 
    {if(wellIntersts.hasOwnProperty(x[0]))
        {
            netOilProductionForWell = newData.map(x => x[3] * wellIntersts[x[0]]);
            netGasProductionForWell = newData.map(x => x[2] * wellIntersts[x[0]])} //SITE[2]*DESIGNATED INTEREST
        });
        //console.log("netOilProductionForWell", netOilProductionForWell);
        
        //zip all_dates to each netOilProductionForWell for that date (dates  are repeated at this point, need to add all wells for date)
        var oilReadyToAddList = _.zip(all_dates, netOilProductionForWell);

        //DONT NEED THIS
        var oilReadyToAdd = _.object(all_dates, netOilProductionForWell);
        
        //console.log("oilReadyToAdd", oilReadyToAdd);
       // console.log(typeof oilReadyToAddList);
       // console.log(Array.isArray(oilReadyToAddList)); //IT IS AN OBJECT, NOT AN ARRAY
        //console.log("oilReadyToAddList", oilReadyToAddList);
        //console.log(oilReadyToAddList[0][0]); //correct way of accesing date 
        //console.log(Object.getOwnPropertyNames(oilReadyToAddList));
        
       var groupedDays = _.groupBy(oilReadyToAddList, "0");
       //console.log(groupedDays); //not an array

       //console.log((typeof groupedDays))


      
       ///TEST///
      //console.log(Object.values(groupedDays))
      Object.values(groupedDays).forEach((day1) =>
      {day1.forEach((well1) => {
          //delete well1["0"];
          well1.splice(0,1).flat();
        //console.log(well1.splice(1,1));
        //console.log(well1);
       // console.log(Object.getOwnPropertyNames(well1));
    }
        )});

        //console.log(("groupedDays", groupedDays))
        flattenDays = [];
        
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        Object.values(groupedDays).forEach(x => 
            {
                //console.log("flat", x.flat(1));
                var y = x.flat(1);

                //console.log(x);
                flattenDays.push(y);
            }
            );
            //console.log(groupedDays); // NOT FLAT
            //console.log(flattenDays); //FLATTEN


    var addedDays= flattenDays.map(x => x.reduce(reducer))

//console.log(addedDays);

            var site_date = [...new Set(all_dates)];

            //console.log(site_date);

           var pairedOilAndDates =  _.object(site_date, addedDays);

           //console.log(pairedOilAndDates); /// GOT OT
            
    //    var productionByDate = {}

    //console.log((flattenGroupDays))

    //     oilReadyToAddList.forEach((day) => {
    //         day["Date"] = day["0"];
    //         day["Production"] = day["1"];
    //         day.splice(0, 2);
           
            
    //     });
        
       
    //      console.log(oilReadyToAddList);

    //      productionByDate = _.groupBy(oilReadyToAddList, "Date"); /// PERHAPS ONLY ADD INDEX[1]???
    //      console.log(productionByDate);




//// TEST ////

        
        // productionByDate = oilReadyToAddList.map(day =>{
        //             day['Date'] = day['0']; // Assign new key
        //             delete day['0']; // Delete old key
        // });
        //         console.log(productionByDate);
            
        

        // productionByDate = oilReadyToAddList.map(date => [date][0][0]);
        //     console.log(productionByDate)
        
        //console.log("===", Object.keys(oilReadyToAddList));

        //console.log(Object.entries(oilReadyToAddList));


        //SKIPS THE LAST REPEATED DATE BECAUSE IT DOES NOT MATCH THE FOLLOWING DATE //
        // repeatedDays = []
        // var addedDay = 0
        // addedArray = []
        // test =[]
        // for (i = 0; i < oilReadyToAddList.length-1; i++) { //consider making this minus(-) however many wells partner is in...but what about plugged wells 
            

        //     if(oilReadyToAddList[i][0] === oilReadyToAddList[i+1][0])
        //         {
        //             console.log(oilReadyToAddList[i]);
        //             repeatedDays.push(oilReadyToAddList[i]);
        //             // addedDay= oilReadyToAddList[i][1] + oilReadyToAddList[i+1][1]
                    
        //             //addedArray = [oilReadyToAddList[i]]
        //         };
            
           
        // };
        // console.log("repeatedDays", repeatedDays);
        
    
       

        //testing//
        // for (var i = repeatedDays.length - 1; i >= 1; i--) {
        //    // console.log(repeatedDays[i]);
        //     if(repeatedDays[i][0] === repeatedDays[i-1][0])
        //     {
        //         repeatedDays[i] = repeatedDays[i][0], (repeatedDays[i][1]+repeatedDays[i-1][1])
        //         repeatedDays.splice(i,1);
        //         //test=repeatedDays[i][0].map(x => repeatedDays[x][1]+repeatedDays[x-1][1])
        //     //    repeatedDays[i] = repeatedDays[i][0], (repeatedDays[i][1]+repeatedDays[i-1][1])
        //     }
            
        // };


        // for (var i = Auction.auctions.length - 1; i >= 0; i--) {
        //     Auction.auctions[i].seconds--;
        //     if (Auction.auctions[i].seconds < 0) { 
        //         Auction.auctions.splice(i, 1);
        //     }
        // }


        
        // for (k=0; k<repeatedDays.length-1; k++){
        //     if(repeatedDays[k][0] === repeatedDays[k+1][0]){
        //     addedArray = [...repeatedDays[k],...repeatedDays[k+1]];
        // test.push(addedArray);}
        // }
        //console.log("test", test);


        // console.log("repeatedDays", repeatedDays);
        // console.log("addedArray", addedArray);
        // console.log("test", test);



        //end teting//



        // NOT WORKING //
        // var addedDay = 0
        // addedArray = []
        // for (i = 0; i < oilReadyToAdd.length-1; i++) {
        //     if (oilReadyToAdd[i[0]]===(oilReadyToAdd[i+1[0]])) {
        //          addedDay = oilReadyToAdd[i][1]+oilReadyToAdd[i+1][1];
        //          addedArray.push(addedDay);
        //          console.log(oilReadyToAdd[i]);                   
        //     }  
        // };
        // console.log("addedArray", addedArray);
        //NOT WORKING//
        

        //THIS ISN'T WORKING
        // addedOil = [];
        // oilReadyToAdd.forEach((netWellDate) => 
        // {
        //     if(netWellDate[0] === (netWellDate+1)[0])
        //     {addedValues = netWellDate[1]+netWellDate[1];
        //     addedOil.push(addedValues);}
        // });
        // // console.log("addedOil", addedOil);

        //////////////////////////////
        // addedOil = [];
        // for (let i =1; i < oilReadyToAdd.length-1; i++)
        // {if (oilReadyToAdd[i][0] === oilReadyToAdd[i+1][0]) //replace value ?
        //     { 
        //         //console.log(i);
        //         addedValue = oilReadyToAdd[i][1] + oilReadyToAdd[i+1][1];
        //         addedOil.push(addedValue[0], );
        //     }};
            //console.log("addedOil", addedOil);

        /////////////////////////////////
            
        

        
        


    //SPLIT netOilProductionForWell INTO ARRAYS OF THE LENGTH OF wellOptions (WELLS PARTNER IS IN)
    var size = wellOptions.length; var arrayOfOilArrays = []; var arrayOfGasArrays = [];

    for (var i=0; i<netOilProductionForWell.length; i+=size) {
         arrayOfOilArrays.push(netOilProductionForWell.slice(i,i+size));
    }
//SPLIT netGasProductionForWell INTO ARRAYS OF THE LENGTH OF wellOptions (WELLS PARTNER IS IN)
    for (var i=0; i<netGasProductionForWell.length; i+=size) {
        arrayOfGasArrays.push(netGasProductionForWell.slice(i,i+size));
   }
    //console.log(arrayOfArrays);
    //REDUCE EACH ARRAY (REDUCE SUMS ALL VALUES IN AN ARRAY)
    //const reducer = (accumulator, currentValue) => accumulator + currentValue;
   // allOilNetsAdded = arrayOfOilArrays.map(x => x.reduce(reducer))
    // allGasNetsAdded = arrayOfGasArrays.map(x => x.reduce(reducer))
    //console.log(allNetsAdded);

    //GET ALL UNIQUE DATES
    //var site_date = [...new Set(all_dates)];
    //console.log(site_date);
    
    //})};

    var mostRecentEntry = site_date[0]; //MOST RECENT DATE WITHOUT HOUR AS VARIABLE
            console.log(mostRecentEntry);
            var addingHours = "T00:00"; //HOURS TO ADD TO MOST RECENT DATE - NEEDED TO NORMALIZE FROM ORIGINAL 19 HOUR FORMAT
            var nextYear = mostRecentEntry.concat(addingHours); //DATE AND HOUR AS SINGLE VARIABLE TO MAKE INTO DATE
            var mostRecentDate = new Date(nextYear); //MAKE VARIABLE INTO DATE
            var nextYearsDate = new Date(mostRecentDate.setFullYear(mostRecentDate.getFullYear() + 1)); //GET YEAR FROM MOST RECENT DATE AND ADD A YEAR
            var nextYear= nextYearsDate.getFullYear() //GET NEXT YEARS DATE
            var nextMonth= nextYearsDate.getMonth() + 1 // GET NEXTS YEARS MONTH, ADD ONE BECAUSE MONTHS ARE INDEXED AT 0
            var nextDate= nextYearsDate.getDate() //GET NEXT YEARS DATE
            nextYearGraph = `${nextYear}-${nextMonth}-${nextDate}`; // CREATE FULL DATE FOR NEXT YEAR IN RIGHT FORMAT FOR AXIS
            console.log(`${nextYearGraph} is a year from the most recent production date. This is from curvesHome()`);
  
            var dataOil = [{
                x: site_date,
                y: addedDays,
                type: "line",
                line:
                    {color: "green"}}];
            var layoutOil = {
                title: "Oil BBL",
                yaxis: {
                    title: "BOPD Net",
                    type: 'log',
                    autorange: true},
                xaxis: {
                    autorange: false,
                    range: [site_date[site_date.length-1], nextYearGraph]}};
  
            Plotly.newPlot("oilDeclineCurve", dataOil, layoutOil);
            var dataGas = [{
                x: site_date,
                y: allGasNetsAdded,
                type: "line",
                line:
                    {color: "red"}}];
            var layoutGas = {
                title: "Gas BBL",
                yaxis: {
                    title: "MCFD Net",
                    type: 'log',
                    autorange: true},
                xaxis: {
                    autorange: false,
                    range: [site_date[site_date.length-1], nextYearGraph]}};
            Plotly.newPlot("gasDeclineCurve", dataGas, layoutGas);

        })};

    });
};
        
        
      
    document.getElementById("partner-name").addEventListener("change", clearWellOptions) //WHEN THE SELECTION ON PARTNERS CHANGES, CLEAR OUT THE WELL OPTIONS
    document.getElementById("partner-name").addEventListener("change", clearCurves) //WHEN THE SELECTION ON PARTNERS CHANGES, CLEAR OUT THE CURVES
// });
; //END OF createOptions() 



d3.select("#partner-name").on('change', createWellOptions); //WHEN THERE IS A CHANGE IN THE PARTNERS SELECT, CREATE WELL OPTIONS FOR THAT PARTNER

function clearWellOptions(){ //FUNCTION TO CLEAR OUT WELL OPTIONS, USED WHEN PARTNER SELECTION IS CHANGED
    document.getElementById("well-options").options.length = 0
 };

 function clearCurves(){ //MAKE THIS INTO DISAPPEARING THE CURVES?
    var site_oil = [];
    var site_gas = [];
    site_date = [];
    
    var dataOil = [{
        x: site_date,
        y: site_oil,
        type: "line",
        line:
            {color: "green"}}];
    var layoutOil = {
        title: "Oil BBL",
        yaxis: {
            type: 'log'}};
        Plotly.newPlot("oilDeclineCurve", dataOil, layoutOil);


    var dataGas = [{
        x: site_date,            
        y: site_gas,
        type: "line",
        line:
            {color: "red"}}];
    var layoutGas = {
        title: "Gas BBL",
        yaxis: {
            type: 'log'}};
    Plotly.newPlot("gasDeclineCurve", dataGas, layoutGas);
};
