build: 
	docker build . -t ionexp.azurecr.io/decentraland

push:
	docker push ionexp.azurecr.io/decentraland