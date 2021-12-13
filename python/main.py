from astropy import units as u
from astropy.coordinates import SkyCoord, AltAz
from astropy.coordinates.earth import EarthLocation 
from astropy.time import Time
import os, json
# import time
from datetime import datetime, timedelta
import sys

#hand over the iteration to the python part, start and end time passed in as YYYY-MM-DDTHH:MM
def getAzAlt(name, lat, long, start, end):
    coord = SkyCoord.from_name(name)
    lat = float(lat)
    long = float(long)
    #could do geolocation detection, determine the utcoffset
    userLocation = EarthLocation(lat = lat * u.deg, lon = long*u.deg, height = 340 * u.m)
    #HH:MM
    date = start.split('T')[0]
    startTime = start.split('T')[1]
    endTime = end.split('T')[1]
    startTimeHour = int(startTime.split(':')[0])
    startTimeMinute = int(startTime.split(':')[1])
    endTimeHour = int(endTime.split(':')[0])
    endTimeMinute = int(endTime.split(':')[1])
    deltaMin = (endTimeHour - startTimeHour - 1) * 60 +  (60 - startTimeMinute) + endTimeMinute;        
    utcoffset = -5 * u.hour
    for x in range(deltaMin):
        startTimeMinute = int(startTimeMinute);
        startTimeHour = int(startTimeHour)
        startTimeMinute = startTimeMinute + 1
        if startTimeMinute >= 60: 
            startTimeMinute = 0
            startTimeHour += 1
        if startTimeMinute < 10: 
            startTimeMinute ='0'+ str(startTimeMinute)
        if startTimeHour < 10:
            startTimeHour = '0' + str(startTimeHour)
        now = date + 'T' + str(startTimeHour) + ':' + str(startTimeMinute)
        currentTime = Time(now, format = 'isot', scale = 'utc') - utcoffset
        transformedCoord = coord.transform_to(AltAz(obstime = currentTime, location = userLocation))
        if(transformedCoord.alt / u.deg > 30):
            print(transformedCoord.az, transformedCoord.alt)

# Pass parameters in terminal, name. lat and long
getAzAlt(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]);