# FastAPI Lambda

## Installation

```shell
# Ready the virtual environment
virtualenv -p python3.7 env
source ./env/bin/activate

# Install Dependencies
pip install -r requirements.txt
```

## Run the application

```shell
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

## Deploy

```shell
# Package Dependencies
cd env/lib/python3.7/site-packages
zip -r9 ${OLDPWD}/function.zip

# Package Lambda
cd $OLDPWD
zip -g function.zip lambda_function.py
```
