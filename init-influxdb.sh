DB_NAME="HVmodule_CAEN_SY4527_database"
RP_NAME="one_day_retention"
RP_DURATION="1d"
RP_REPLICATION="1"

influx -execute "CREATE RETENTION POLICY ${RP_NAME} ON ${DB_NAME} DURATION ${RP_DURATION} REPLICATION ${RP_REPLICATION} DEFAULT"

echo "Database and retention policy set up completed."