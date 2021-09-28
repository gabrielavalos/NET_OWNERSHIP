import pandas as pd
import numpy as np
from datetime import datetime, timedelta
pd.options.display.max_rows = 999

#READ IN PRODUCTION, WELL NAMES WITH IDs LIST, AND INTEREST DATA
production = pd.read_csv("C:/Users/avalosg/OneDrive - CML Exploration/Database/data.csv", usecols=[0,1,2,3,4])
ids = pd.read_csv("raw data\well_id.csv")
interests = pd.read_csv("raw data\PARTNER_INTERESTS.csv", usecols=[0,2,3,4,5,6,7,8,9,10,11])
interests.fillna("", axis=1, inplace=True)



#MERGE WELL IDs TO PRODUCTION
df = pd.merge(ids, production, on='Well Name')

#MERGE WELLS AND WELL DESIGNATED IDS TO PARTNER'S INTERSTS
nets = pd.merge(df, interests, on="ID")

#SAVE DF CONTAINING ALL PRODUCTION AND PARTNER INTEREST AS A CSV
nets.to_csv("raw data/production-partner-revenue-interest.csv")

#CREATE A NEW DF TO MULTIPLY DAILY PRODUCTION BY INTEREST
nets_ownership = nets
nets_ownership.replace("",0, inplace=True)

#MULTIPLY EACH INTEREST BY DAILY PRODUCTION
nets_ownership["CASEY-OIL"] = nets["Oil (BBLS)"] * nets["35810"].astype(float)
nets_ownership["CASEY-GAS"] = nets["Gas (MCF)"] * nets["35810"].astype(float)
nets_ownership["CML-OIL"] = nets["Oil (BBLS)"] * nets["3"].astype(float)
nets_ownership["CML-GAS"] = nets["Gas (MCF)"] * nets["3"].astype(float)
nets_ownership["IDC-OIL"] = nets["Oil (BBLS)"] * nets["21723"].astype(float)
nets_ownership["IDC-GAS"] = nets["Gas (MCF)"] * nets["21723"].astype(float)
nets_ownership["JASON-OIL"] = nets["Oil (BBLS)"] * nets["30058"].astype(float)
nets_ownership["JASON-GAS"] = nets["Gas (MCF)"] * nets["30058"].astype(float)
nets_ownership["KEN-OIL"] = nets["Oil (BBLS)"] * nets["21927"].astype(float)
nets_ownership["KEN-GAS"] = nets["Gas (MCF)"] * nets["21927"].astype(float)
nets_ownership["LANMLN-OIL"] = nets["Oil (BBLS)"] * nets["35104"].astype(float)
nets_ownership["LANMLN-GAS"] = nets["Gas (MCF)"] * nets["35104"].astype(float)
nets_ownership["PATTERSON-OIL"] = nets["Oil (BBLS)"] * nets["1"].astype(float)
nets_ownership["PATTERSON-GAS"] = nets["Gas (MCF)"] * nets["1"].astype(float)
nets_ownership["PHIL-OIL"] = nets["Oil (BBLS)"] * nets["24363"].astype(float)
nets_ownership["PHIL-GAS"] = nets["Gas (MCF)"] * nets["24363"].astype(float)
nets_ownership["TRAVIS-OIL"] = nets["Oil (BBLS)"] * nets["37745"].astype(float)
nets_ownership["TRAVIS-GAS"] = nets["Gas (MCF)"] * nets["37745"].astype(float)
nets_ownership["KYLE-OIL"] = nets["Oil (BBLS)"] * nets["35471"].astype(float)
nets_ownership["KYLE-GAS"] = nets["Gas (MCF)"] * nets["35471"].astype(float)

#DROP PRODUCTION AND INTEREST COLUMNS - ONLY DAILY PRODUCTION OWNERSHIP BY WELL REMAINS FOR EACH PARTNER
nets_ownership.drop(["Oil (BBLS)","Gas (MCF)","Water (BBLS)", "3","21927","35810","24363","21723","30058", "35104","1","37745","35471"], axis=1)

#print(nets_ownership)


#SAVE DAILY PRODUCTION OWNED BY WELL AS A CSV
nets_ownership.to_csv("raw data/daily-partner-revenue-by-well.csv")

#GROUP EACH PARTNERS OWNERSHIP BY DATE
casey_oil = pd.Series(nets_ownership.groupby("Date")["CASEY-OIL"].sum())
casey_gas = pd.Series(nets_ownership.groupby("Date")["CASEY-GAS"].sum())
cml_oil = pd.Series(nets_ownership.groupby("Date")["CML-OIL"].sum())
cml_gas = pd.Series(nets_ownership.groupby("Date")["CML-GAS"].sum())
idc_oil = pd.Series(nets_ownership.groupby("Date")["IDC-OIL"].sum())
idc_gas = pd.Series(nets_ownership.groupby("Date")["IDC-GAS"].sum())
jason_oil = pd.Series(nets_ownership.groupby("Date")["JASON-OIL"].sum())
jason_gas = pd.Series(nets_ownership.groupby("Date")["JASON-GAS"].sum())
ken_oil = pd.Series(nets_ownership.groupby("Date")["KEN-OIL"].sum())
ken_gas = pd.Series(nets_ownership.groupby("Date")["KEN-GAS"].sum())
lanmln_oil = pd.Series(nets_ownership.groupby("Date")["LANMLN-OIL"].sum())
lanmln_gas = pd.Series(nets_ownership.groupby("Date")["LANMLN-GAS"].sum())
patterson_oil = pd.Series(nets_ownership.groupby("Date")["PATTERSON-OIL"].sum())
patterson_gas = pd.Series(nets_ownership.groupby("Date")["PATTERSON-GAS"].sum())
phil_oil = pd.Series(nets_ownership.groupby("Date")["PHIL-OIL"].sum())
phil_gas = pd.Series(nets_ownership.groupby("Date")["PHIL-GAS"].sum())
travis_oil = pd.Series(nets_ownership.groupby("Date")["TRAVIS-OIL"].sum())
travis_gas = pd.Series(nets_ownership.groupby("Date")["TRAVIS-GAS"].sum())
kyle_oil = pd.Series(nets_ownership.groupby("Date")["KYLE-OIL"].sum())
kyle_gas = pd.Series(nets_ownership.groupby("Date")["KYLE-GAS"].sum())

#PUT ALL DAILY SUMMED DATA IN SINGLE DF WITH MULTI COLUMNS (PARTNER, OIL & GAS)
#DATA GOING INTO DF (DATE IS COLUMN NAME IS DATA WAS GROUPED BY DATE)
data= [casey_oil, casey_gas, cml_oil, cml_gas, idc_oil, idc_gas, jason_oil, jason_gas, ken_oil,ken_gas, lanmln_oil, lanmln_gas, patterson_oil,patterson_gas, phil_oil,phil_gas, travis_oil,travis_gas, kyle_oil, kyle_gas]

gas_data= [casey_gas, cml_gas, idc_gas, jason_gas, ken_gas,lanmln_gas, patterson_gas,phil_gas,travis_gas, kyle_gas]
oil_data= [casey_oil, cml_oil, idc_oil, jason_oil, ken_oil,lanmln_oil, patterson_oil,phil_oil,travis_oil, kyle_oil]

#CREATE DATAFRAME FOR GAS AND OIL GROUP & GAS AND OIL INDIVIDUAL, TRANSPOSE SO DATE IS IN ROW POSITION
grouped_nets = pd.DataFrame(data).transpose()
gas_nets = pd.DataFrame(gas_data).transpose()
oil_nets = pd.DataFrame(oil_data).transpose()

#NEW COLUMN NAMES CREATED BASED ON PARTNER AND THE OWNERSHIIP (OIL & GAS)
#partners_output = [["3", "21297", "35810", "24363", "21723", "30058", "35104", "1", "37745"],["OIL", "GAS"]]
partners_output = [["Casey", "CML", "IDC", "Jason", "Ken", "LAN MLN", "Patterson", "Phil", "Travis", "Kyle"],["OIL", "GAS"]]
#MAXING COLUMN NAMES FIT MULTI-INDEX FORMAT USING COLUMN NAMES CREATED IN ABOVE LINE
grouped_nets.columns = pd.MultiIndex.from_product(partners_output, names=["partner","ownership"])
#RESETING INDEX SO THAT DATE COLUMN CAN BE CONVERTED TO DATETIME AND SORTED
grouped_nets.reset_index(inplace=True)
#grouped_nets

#SAVE OIL DATA TO CSV
oil_nets.rename(columns={'CML-OIL':'CML','CASEY-OIL':'CASEY','IDC-OIL':'IDC','JASON-OIL':'JASON','KEN-OIL':'KEN','LANMLN-OIL':'LAN MLN','PATTERSON-OIL':'PATTERSON','PHIL-OIL':'PHIL','TRAVIS-OIL':'TRAVIS','KYLE-OIL':'KYLE'}, inplace= True)
oil_nets.to_csv("raw data/ownership-oil.csv")

#FORMAT DATA FOR JSON FILE AND SAVE
oil_nets.reset_index(inplace=True)
oil_nets.to_json("C:\\Users\\avalosg\\OneDrive - CML Exploration\\Desktop\\PARTNER_NET_INTEREST\\static\\ownership-oil.json", orient="records", date_format='iso')

#SAVE GAS DATA CSV
gas_nets.rename(columns={'CML-GAS':'CML','CASEY-GAS':'CASEY','IDC-GAS':'IDC','JASON-GAS':'JASON','KEN-GAS':'KEN','LANMLN-GAS':'LAN MLN','PATTERSON-GAS':'PATTERSON','PHIL-GAS':'PHIL','TRAVIS-GAS':'TRAVIS','KYLE-GAS':'KYLE'},inplace= True)
gas_nets.to_csv("raw data/ownership-gas.csv")
#FORMAT DATA FOR JSON FILE AND SAVE
gas_nets.reset_index(inplace=True)
gas_nets.to_json("C:\\Users\\avalosg\\OneDrive - CML Exploration\\Desktop\\PARTNER_NET_INTEREST\\static\\ownership-gas.json", orient="records", date_format='iso')

#SAVE GROUPED OIL AND GAS IN A SINGLE CSV
grouped_nets.to_csv("raw data\daily-partner-ownership.csv")