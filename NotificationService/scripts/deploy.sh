#!/bin/bash -e

# Values within #{} get replaced at runtime by OctopusDeploy
awsAccessKey='#{AWS-AccessKeyId}'
awsRegion='#{AWS-Region}'
awsSecretKey='#{AWS-SecretAccessKey}'
environment=$(echo '#{Octopus.Environment.Name}' | tr '[:upper:]' '[:lower:]')
version='#{Octopus.Action.Package.PackageVersion}'

export API_URL="#{API-Url}"
export API_USER="#{API-User}"
export API_PASSWORD="#{API-Password}"
export APPINSIGHTS_INSTRUMETNATION_KEY="#{AppInsights-InstrumentationKey}"
export AWS_ACCESS_KEY_ID="#{AWS-AccessKeyId}"
export AWS_REGION="#{AWS-Region}"
export AWS_SECRET_KEY="#{AWS-SecretAccessKey}"
export AWS_SEND_MAIL_ARN="#{AWSSNS-SendMailArn}"
export LOG_LEVEL="#{LogLevel}"

# Get the script directory
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Include the variables
. "$dir/variables.sh" -v $version

# Install any prerequisites
. "$dir/deploy-prereqs.sh"

cat << EOF
=============================================================
Deployment Variables
=============================================================

API URL: $API_URL
API User: $API_USER
AWS Region: $awsRegion
AWS Send Mail ARN: $AWS_SEND_MAIL_ARN
Environment: $environment
Log Level: $LOG_LEVEL
Version: $version

EOF

# The servless.yml doesn't need the plugins to deploy
sed -i '/plugins/d' ./serverless.yml
sed -i '/serverless-webpack/d' serverless.yml
sed -i '/serverless-offline/d' ./serverless.yml

echo "Configuring AWS credentails with 'serverless config credentials -o ..."
serverless config credentials -o --provider aws --key $awsAccessKey --secret $awsSecretKey

echo "Deploying with 'serverless deploy -p ./"
serverless deploy -p ./
