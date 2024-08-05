'''
import time
import random
from influxdb import InfluxDBClient

# InfluxDB connection parameters
host = 'localhost'
port = 8086
database = 'mydb'

# Create a client instance for InfluxDB
client = InfluxDBClient(host, port, database=database)

try:
    while True:
        # Generate a temperature value around 23 ± 5 degrees Celsius
        temperature = 23 + random.uniform(-5, 5)
        
        # Create a data point
        data_point = [
            {
                "measurement": "temperature",
                "tags": {
                    "location": "server_room"
                },
                "fields": {
                    "value": temperature
                }
            }
        ]
        
        # Write the data point to InfluxDB
        client.write_points(data_point)
        
        print(f"Temperature value {temperature:.2f} written to InfluxDB")

        # Wait for 5 seconds before sending the next data point
        time.sleep(5)

except KeyboardInterrupt:
    print("Interrupted by user")

finally:
    client.close()
'''
























# this code wants to fetch data from CAEN SY4527 high voltage module and interogate its structure
# caenHVM structure available here
# code should construct a database and then put data inside 

# -------------------------------------------------------------- importing necessary libraries -----------------------------------------------------------------------------------------
# ---------------------- comm with database -----------------------------------
from influxdb import InfluxDBClient
# ---------------------- comm with EPICS module using epics protocol installed on local machine hosting as address the ip of CAEN 4527( e9 ) high voltage module -----------------------
from epics import caget
# date time libraries for eventual time stamps
from datetime import datetime
import pytz
# ----------------------- threading for job assignment periodically to keep main programm alive and not in loop suspension -------------------------------------------------------------
import threading
import time

# set up as client for the database
iAmClient = InfluxDBClient( host='localhost' , port=8086 , database='HVmodule_CAEN_SY4527_database' )

# set up experiments parameters 
moduleBNo = 9
moduleBChNo = 12
moduleServiceName = 'fcebd5e8815db780'          # epics service name
voltage = 'VMon'    # same as SVMax
current = 'IMon'    # same as SVMax
maxVoltage = 'SVMax'  # p.v. taken from documentation , under service name : board no : channel no : SVMax
boardTemp = 'Temp'  # p.v. taken from documentation, under service name : board no : Temp

countReconnections = 0  # global variable

# creating a function that fetches data from epics interface of the module
def get_data_from_epics_module_interface(fModule, fBoards, fChannels):
    global countReconnections
    dataAsJSONbody = []
    for bContor in range(fBoards):
        for chContor in range(fChannels):
            # fetch the process variables named specifically after documentation  on different boards and channels
            # boards have 2 digits: 00 , 01 , 03 , 04 , 10 so on ..... i use zfill to do such strings
            # channels have 3 digits: 000 , 001 , 010 , 015 , so on .... again using zfill for such a thing
            # p.v's are took with caget which gets the string meaning the address of the p.v on the moduel  ( syntax:   servicename:board:cahnnel:PV )
            
            obtainedVoltge = caget(fModule + ':' + str(bContor).zfill(2) + ':' + str(chContor).zfill(3) + ':' + voltage)
            obtainedCurrent = caget(fModule + ':' + str(bContor).zfill(2) + ':' + str(chContor).zfill(3) + ':' + current )
            obtainedVMax = caget( fModule + ':' + str( bContor ) . zfill( 2 ) + ':' + str( chContor ) . zfill( 3 ) + ':' + maxVoltage )
            obtainedBoardTemperature = caget( fModule + ':' + str( bContor ) . zfill( 2 ) + ':' + boardTemp )
            
            dataAsJSONbody.append({
                'measurement': 'hv_module',
                'tags': {
                    'board': bContor,
                    'channel': chContor
                },
                'fields': {
                    'VMon': obtainedVoltge,
                    'IMon': obtainedCurrent,
                    'SVMax': obtainedVMax ,
                    'BTemp': obtainedBoardTemperature 
                }
            })
    print(bContor, " ", chContor, " ", obtainedVoltge, " ", obtainedCurrent , "  " , obtainedVMax )
    print('Writing to client ( Voltage , Current , Max Voltage , Board Temperature ): JSON body\n')
    iAmClient.write_points(dataAsJSONbody)
    countReconnections += 1

# a function that will periodically call the fetcher
def periodic_job():
    global countReconnections
    if countReconnections == 0:
        print(f"first connection to CAEN HV module:  {moduleServiceName}")
    else:
        print(f"reconnection no{countReconnections + 1} to CAEN HV module: {moduleServiceName}")

    get_data_from_epics_module_interface(moduleServiceName, moduleBNo, moduleBChNo)
    threading.Timer(2, periodic_job).start()

# starting periodic job  ---- uses thread to balance the main execution and periodic job execution
periodic_job()

# keep alive the main program   in parallel with the periodic job
try:
    while True:
        time.sleep(2)
except KeyboardInterrupt:
    print('Execution aborted by user')