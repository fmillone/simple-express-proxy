
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USER" --password-stdin
docker build -t fmillone/simple-express-proxy:latest .
docker build -t fmillone/simple-express-proxy:$TRAVIS_TAG .
docker push fmillone/simple-express-proxy