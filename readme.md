Deploy (region is ignored from ~/.aws/config)

        `sls deploy --aws-profile serverless-admin --stage dev --region eu-central-1`
        `sls remove --aws-profile serverless-admin --stage dev --region us-east-1`
        
How to run:
 1) Create SNS topic and update `SLS_RUN_ARN`

TODO:
    1) Check SNS with serverless configuration