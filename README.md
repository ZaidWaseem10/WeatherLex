# Slackbot with AWS Lex and Lambda
This repository contains an example of a slack bot with AWS Lex and Lambda, for details and a walk through on how this was created please read the blog post at: [chttps://nicholasjackson.io/2017/04/25/slack-bot-aws-lambda/](https://nicholasjackson.io/2017/04/25/slack-bot-aws-lambda/).

This project does not use any frameworks such as [Serverless](serverless.com) or [Apex](apex.run).  It is a plain example which uses [Terraform](terraform.io) to deploy the Lambda function.

## Requirements:
* Terraform 0.9 or greater [http://terraform.io](http://terraform.io)
* NodeJS 4.3 or greater
* Yarn [https://yarnpkg.com/lang/en/](https://yarnpkg.com/lang/en/)

## Caviates
* I am not a JavaScript programmer
* This not a comprehensive example but more of a getting started
* Deployment to AWS may incur costs

## Building
The code is written in Javascript and requires no building as such however there is a build step which will copy the required files and install the node modules ready for packaging to AWS Lambda.

```
$ make build
```

## Testing
Testing is performed with [Jest](https://facebook.github.io/jest/), to run the example tests:

```
$ make test
```

The tests are not comprehensive however and are intended to show how unit tests can be leveraged to cover the inability to run the application code locally with AWS Lambda.

## Deploying
Set the following environment variables I recommend using direnv [https://direnv.net](https://direnv.net):

| Variable | Description |
| -------- | ----------- |
| AWS_SECRET | The secret for your AWS account |
| AWS_SECRET_KEY | The secret key for your AWS account |

Run...

```
$ make deploy
```

The function will be deployed to `us-east-1` virginia which is currently the only region which supports Lex.

## Example Test Event for AWS Lambda

```json
{
  "currentIntent": {
    "slots": {
      "Location": "London"
    },
    "name": "WeatherLex",
    "confirmationStatus": "None"
  },
  "bot": {
    "alias": "$LATEST",
    "version": "$LATEST",
    "name": "WeatherLex"
  },
  "userId": "John",
  "invocationSource": "DialogCodeHook",
  "outputDialogMode": "Text",
  "messageVersion": "1.0",
  "sessionAttributes": {}
}

