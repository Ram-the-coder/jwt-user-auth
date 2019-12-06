Two databse driver options is currently supported:
1. mongodb
2. mongoose

To select which one to use, set it as the environment variable "DB_DRIVER"
The corresponding src/db/DB_DRIVER file will be used to manipulate the database. So you don't need the other files in src/db. Also remember to install the dependenices required for the specific driver. The required dependencies are the ones imported in the corresponding src/db/DB_DRIVER file.
