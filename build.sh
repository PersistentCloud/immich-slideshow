DEFAULT_REGISTRY="docker.io"

REGISTRY=$1

if [[ $1 == "" ]]; then
  REGISTRY=$DEFAULT_REGISTRY;
fi;

echo "Used registry: ${REGISTRY}";

echo "Extracting version from package.json";
VERSION=$( echo "$(<package.json )" | jq '."version"' | tr -d '"');
echo "Extracted version: ${VERSION}";

echo "Docker building...";
docker compose -f docker-compose.build.yaml build;

echo "Setting docker tag...";
IMAGE_ID=$(docker images -q | head -n 1);
IMAGE_REPOSITORY=$(docker images --format "{{.Repository}}" | head -n 1);
echo $IMAGE_REPOSITORY
docker tag $IMAGE_ID $REGISTRY/$IMAGE_REPOSITORY:latest;
docker tag $IMAGE_ID $REGISTRY/$IMAGE_REPOSITORY:$VERSION;
echo "Tag $REGISTRY/$IMAGE_REPOSITORY:latest set";
echo "Tag $REGISTRY/$IMAGE_REPOSITORY:$VERSION set";

echo "Pushing docker image...";
docker push $REGISTRY/$IMAGE_REPOSITORY:$VERSION
docker push $REGISTRY/$IMAGE_REPOSITORY:latest;
