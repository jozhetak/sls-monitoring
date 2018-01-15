APIDOC: http://sls-bucket-apidoc-staging.s3-website.eu-central-1.amazonaws.com

Deploy (region is ignored from ~/.aws/config)

        `sls deploy --aws-profile serverless-deploy --stage dev --region eu-central-1`
        `sls deploy function --aws-profile serverless-deploy --stage dev --region eu-central-1 --function _`
        `sls remove --aws-profile serverless-deploy --stage dev --region us-central-1`
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
    
POLICY (Monitoring Account)

    CloudWatchLogsReadOnlyAccess
     
    AWSLambdaReadOnlyAccess
     
POLICY (Deployment permissions)

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "VisualEditor0",
                "Effect": "Allow",
                "Action": [
                   "lambda:ListTags",
                   "lambda:TagResource",
                   "lambda:UntagResource",
                   "SNS:Subscribe",
                   "SNS:GetTopicAttributes",
                   "SNS:CreateTopic",
                   "SNS:ListTopics",
                   "lambda:AddPermission",
                   "logs:CreateLogStream",
                   "lambda:DeleteFunction",
                   "iam:DeleteRole",
                   "iam:PassRole",
                   "lambda:CreateFunction",
                   "iam:DeleteRolePolicy",
                   "lambda:GetFunction",
                   "iam:PutRolePolicy",
                   "SNS:DeleteTopic",
                   "lambda:PublishVersion",
                   "lambda:ListVersionsByFunction",
                   "dynamodb:ListTables",
                   "iam:CreateRole",
                   "lambda:GetFunctionConfiguration",
                   "cloudformation:DescribeStackResource",
                   "dynamodb:DeleteTable",
                   "apigateway:DELETE",
                   "cloudformation:DescribeStackEvents",
                   "dynamodb:DescribeTable",
                   "apigateway:PATCH",
                   "cloudformation:UpdateStack",
                   "apigateway:GET",
                   "iam:GetRole",
                   "logs:DescribeLogGroups",
                   "logs:DeleteLogGroup",
                   "apigateway:PUT",
                   "s3:*",
                   "cloudformation:DescribeStackResources",
                   "logs:CreateLogGroup",
                   "apigateway:OPTIONS",
                   "cloudformation:DescribeStacks",
                   "dynamodb:CreateTable",
                   "lambda:UpdateFunctionCode",
                   "cloudformation:CreateStack",
                   "apigateway:HEAD",
                   "cloudformation:DeleteStack",
                   "apigateway:POST",
                   "lambda:RemovePermission",
                   "cloudformation:ValidateTemplate"
                ],
                "Resource": "*"
            }
        ]
    }
    
How to clean up:
    - delete s3 sources
    - delete sns and Subscription
    - delete IAM lambda role
    - delete CloudFormation stack

Functions Model Schema

    _id : uuid  // b3c623b0-ebbe-11e7-bdcd-cd7e3f9e66fe
    _account: account id // b3c623b0-ebbe-11e7-bdcd-cd7e3f9e66fe
    arn: The Amazon Resource Name (ARN) assigned to the function. // arn:aws:lambda:eu-central-1:353837645447:function:sls-tm-collect-dev-getUser
    codeSize: The size, in bytes, of the function .zip file you uploaded. // 731165
    memSize: The memory size, in MB, you configured for the function. Must be a multiple of 64 MB. // 1024
    name: The name of the function. Note that the length constraint applies only to the ARN. If you specify only the function name, it is limited to 64 characters in length. // sls-tm-collect-dev-getUser
    timeout: The function execution time at which Lambda should terminate the function. Because the execution time has cost implications, we recommend you set this value based on your expected execution time. The default is 3 seconds. // 300
    
 Invocations Model Schema
    
    _id : uuid  // b3c623b0-ebbe-11e7-bdcd-cd7e3f9e66fe
    _account: account id // b3c623b0-ebbe-11e7-bdcd-cd7e3f9e66fe
    _function: function id // b3c623b0-ebbe-11e7-bdcd-cd7e3f9e66fe
    billedDuration: The billed duration will be rounded up to the nearest 100 millisecond // 200
    duration: Measures the elapsed wall clock time from when the function code starts executing as a result of an invocation to when it stops executing. //100
    error: error existence// 1
    errorType: type of error // error
    logStreamName: // 2017/12/28/[$LATEST]a61170b493cc44c3bfe08f1778a1380e
    logs: [
        {
            eventId: The ID of the event.//33773592922032033623252972461104249685054501853208182784
            ingestionTime: The time the event was ingested, expressed as the number of milliseconds after Jan 1, 1970 00:00:00 UTC //1514460284700
            logStreamName: The name of the log stream this event belongs to.// 2017/12/28/[$LATEST]a61170b493cc44c3bfe08f1778a1380e
            message: The data contained in the log event. // START RequestId: b4237f42-ebc1-11e7-8177-5366a0455161 Version: $LATEST\n
            timestamp: The time the event occurred, expressed as the number of milliseconds after Jan 1, 1970 00:00:00 UTC. // 1514460284684
        }
    ]
    memory: MB// 1024
    memoryUsed: MB// 94