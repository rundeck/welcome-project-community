echo "Init Script Starting"
## Place Init Script Code here as needed.  This is run as part of DockerFile steps for Client node.
ssh-keygen -q -t rsa -N '' -f /rundeck-cli/data/keys/id_rsa

cat $CONFIG_FILE

chmod +x bin/cli

echo "Data Dir"
ls -last /rundeck-cli/data
echo "-----"

# load project
./bin/cli load --rundeck_url $RUNDECK_URL --config_file "$CONFIG_FILE" --path /rundeck-cli
./bin/cli addUsers --rundeck_url $RUNDECK_URL --config_file "$CONFIG_FILE" --path /rundeck-cli

# update a value in a specified project
# See rundeckpro/sensu-demo repo for detailed example use
#./bin/cli update --rundeck_url $RUNDECK_URL --project_name "runbooks-project" --input_value "none"
