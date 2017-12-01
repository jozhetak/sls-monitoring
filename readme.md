Deploy (region is ignored from ~/.aws/config)

        `sls deploy --aws-profile serverless-admin --stage dev --region eu-central-1`
        `sls deploy function --aws-profile serverless-admin --stage dev --region eu-central-1 --function _`
        `sls remove --aws-profile serverless-admin --stage dev --region us-central-1`
        `serverless package --package my-artifacts --stage dev --region eu-central-1`
        
How to run:
 1) Create SNS topic and update `SLS_RUN_ARN`

TODO:
    1) Check SNS with serverless configuration
    
    
In event of error:

    ENFILE: file table overflow, scandir
    EMFILE: too many open files, scandir
    
Use this: 
    
    echo kern.maxfiles=65536 | sudo tee -a /etc/sysctl.conf && echo kern.maxfilesperproc=65536 | sudo tee -a /etc/sysctl.conf && sudo sysctl -w kern.maxfiles=65536 && sudo sysctl -w kern.maxfilesperproc=65536 && ulimit -n 65536
    
    
UPDATE POLICY

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "VisualEditor0",
                "Effect": "Allow",
                "Action": [
                    "apigateway:DELETE",
                    "apigateway:GET",
                    "apigateway:HEAD",
                    "apigateway:OPTIONS",
                    "apigateway:PATCH",
                    "apigateway:POST",
                    "apigateway:PUT",
                    "cloudformation:CreateStack",
                    "cloudformation:DeleteStack",
                    "cloudformation:DescribeStackEvents",
                    "cloudformation:DescribeStackResource",
                    "cloudformation:DescribeStackResources",
                    "cloudformation:DescribeStacks",
                    "cloudformation:UpdateStack",
                    "cloudformation:ValidateTemplate",
                    "dynamodb:CreateTable",
                    "dynamodb:DescribeTable",
                    "dynamodb:ListTables",
                    "iam:GetRole",
                    "lambda:GetFunctionConfiguration",
                    "lambda:RemovePermission",
                    "lambda:UpdateFunctionCode",
                    "logs:CreateLogGroup",
                    "logs:DeleteLogGroup",
                    "logs:DescribeLogGroups",
                    "s3:*"
                ],
                "Resource": "*"
            }
        ]
    }
