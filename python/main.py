from astropy import units as u
from astropy.coordinates import SkyCoord, AltAz
from astropy.coordinates.earth import EarthLocation 
from astropy.time import Time
import time
from datetime import datetime, timedelta
import sys

def getAzAlt(name, lat, long):
    coord = SkyCoord.from_name(name)
    lat = float(lat)
    long = float(long)
    userLocation = EarthLocation(lat = lat * u.deg, lon = long*u.deg, height = 340 * u.m)
    now = datetime.now()
    utcoffset = -5 * u.hour
    if now.microsecond >= 500_000:
        now += timedelta(seconds = 1)
    now = now.replace(microsecond=0)
    currentTime = Time(now) - utcoffset
    transformedCoord = coord.transform_to(AltAz(obstime = currentTime, location = userLocation))
    print(transformedCoord)

getAzAlt(sys.argv[1], sys.argv[2], sys.argv[3]);

