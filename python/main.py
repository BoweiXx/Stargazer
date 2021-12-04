from astropy import units as u
from astropy.coordinates import SkyCoord, AltAz
from astropy.coordinates.earth import EarthLocation 
from astropy.time import Time
# import time
from datetime import datetime, timedelta
import sys


def getAzAlt(name, lat, long, time):
    coord = SkyCoord.from_name(name)
    lat = float(lat)
    long = float(long)
    #could do geolocation detection, determine the utcoffset
    userLocation = EarthLocation(lat = lat * u.deg, lon = long*u.deg, height = 340 * u.m)
    now = time
    print(now)
    utcoffset = -5 * u.hour
    # if now.microsecond >= 500_000:
    #     now += timedelta(seconds = 1)
    # now = now.replace(microsecond=0)
    currentTime = Time(now, format = 'isot', scale = 'utc') - utcoffset
    transformedCoord = coord.transform_to(AltAz(obstime = currentTime, location = userLocation))
    print(transformedCoord.az, transformedCoord.alt)
# Pass parameters in terminal, name. lat and long
getAzAlt(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]);

