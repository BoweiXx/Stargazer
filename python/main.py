from astropy import units as u
from astropy.coordinates import SkyCoord, AltAz
from astropy.coordinates.earth import EarthLocation 
import time

def getCoord(name, location, time):
    coord = SkyCoord.from_name(name)
    userLocation = EarthLocation(lat = location.lat * u.deg, lon = location.lon * u.deg, height = 390 * u.m)
    print(name)

