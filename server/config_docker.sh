docker-machine rm default
docker-machine create -d virtualbox --virtualbox-cpu-count=2 --virtualbox-memory=2048 default
docker-machine stop
exit