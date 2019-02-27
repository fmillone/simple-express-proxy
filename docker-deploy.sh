
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USER" --password-stdin || exit 1
echo Building tag $TRAVIS_TAG
docker build -t fmillone/simple-express-proxy:latest . || exit 1
docker build -t fmillone/simple-express-proxy:$TRAVIS_TAG . || exit 1
docker push fmillone/simple-express-proxy || exit 1