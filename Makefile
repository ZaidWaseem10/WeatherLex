package: 
	cd src && yarn install

test:
	cd src && yarn run jest

clean:
	rm -rf _build

build: clean
	mkdir _build
	cp src/index.js _build/
	cp src/dispatcher.js _build/
	cp src/weather.js _build/
	npm install --prefix=_build weather-yahoo

deploy: test build
	cd terraform && terraform plan
	cd terraform && terraform apply
