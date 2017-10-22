#
# script to export env vars on heroku by reading them from my local env vars
#

heroku config:set -a teammanager9 TEAM_MANAGER_MONGODB_URI=$TEAM_MANAGER_PROD_MONGODB_URI

heroku config:set -a teammanager9 TEAM_MANAGER_SECRET_KEY=$TEAM_MANAGER_SECRET_KEY

heroku config:set -a teammanager9 TEAM_MANAGER_GMAIL_USER=$TEAM_MANAGER_GMAIL_USER

heroku config:set -a teammanager9 TEAM_MANAGER_GMAIL_PASS=$TEAM_MANAGER_GMAIL_PASS

heroku config:set -a teammanager9 TEAM_MANAGER_GMAIL_CLIENT_ID=$TEAM_MANAGER_GMAIL_CLIENT_ID

heroku config:set -a teammanager9 TEAM_MANAGER_GMAIL_CLIENT_SECRET=$TEAM_MANAGER_GMAIL_CLIENT_SECRET

heroku config:set -a teammanager9 TEAM_MANAGER_GMAIL_REFRESH_TOKEN=$TEAM_MANAGER_GMAIL_REFRESH_TOKEN
