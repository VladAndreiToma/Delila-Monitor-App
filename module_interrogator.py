#this code aims to fetch data of interest from the HV module by CAEN @ 172.18.6.203
#id parameters of the module: check the module list provided aside this script txt file

from influxdb import InfluxDBClient
from epics import caget
from datetime import datetime
import pytz
import threading
import time

# setup client to the database
iAmClient = InfluxDBClient( host = 'localhost' , port = 8086 , database = 'HVmodule_CAEN_SY4527_database' )
# setup exp parameter
bNo = 9
channels = 12
msn = 'fcebd5e8815db780'
voltage = 'VMon'
current = 'IMon'
max_voltage = 'SVMax'
status = 'Status'

def write_data_to_influx(data_json):
    try:
        iAmClient.write_points(data_json)
    except requests.exceptions.ConnectionError as e:
        print(f"Connection error occurred: {e}")
        # Optionally wait before retrying
        time.sleep(5)
        # Retry logic or other error handling
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


def get_data_from_module_with_epics(  fmodule , fboards , fchannels ):
    data_json = []
    for bContor in range( fboards ):
        for chContor in range( fchannels ):
            gotVoltage = caget( fmodule + ":" + str( bContor ) . zfill( 2 ) + ":" + str( chContor ) . zfill( 3 ) + ":" + voltage )
            gotCurrent = caget( fmodule + ":" + str( bContor ) . zfill( 2 ) + ":" + str( chContor ) . zfill( 3 ) + ":" + current )
            gotVoltageMax = caget( fmodule + ":" + str( bContor ) . zfill( 2 ) + ":" + str( chContor ) . zfill( 3 ) + ":" + max_voltage )
            gotStatus = caget( fmodule + ":" + str( bContor ) . zfill( 2 ) + ":" + str( chContor ) . zfill( 3 ) + ":" + status )
            data_json . append( {
                'measurement' : 'hv_module',
                'tags':{
                    'board' : bContor,
                    'channel' : chContor
                },
                'fields':{
                    voltage : gotVoltage,
                    current : gotCurrent,
                    max_voltage : gotVoltageMax,
                }
            } )
    print( bContor , chContor , gotVoltage , gotCurrent , gotStatus , gotVoltageMax )
    print( "Writting to client: JSON body\n" )
    write_data_to_influx( data_json=data_json )

def periodic_job_that_calls_fetch():
    get_data_from_module_with_epics( msn , bNo , channels )
    threading . Timer( 1 , periodic_job_that_calls_fetch ) . start()

periodic_job_that_calls_fetch()

try:
    while True:
        time . sleep( 1 )
except KeyboardInterrupt:
    print( "Fetcher aborted by user!" )