from astropy import units as u
from astropy.coordinates import SkyCoord, AltAz
from astropy.coordinates.earth import EarthLocation 

print(SkyCoord.from_name('M33'))
customerLocation = EarthLocation(lat = 10 * u.deg, lon =10 * u.deg, height = 390 * u.m)
print(customerLocation)