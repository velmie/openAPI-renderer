# openAPI-renderer

### Summary
* Automatically scans S3 bucket for `openapi.yml` files, and populates service/version dropdown menus
* Displays documentation using ReDoc UI, based on the selected service/version


### Local Setup
1. `npm install`
2. `cp .env.sample .env`
3. _(Modify .env)_
4. `npm start`


```bash
DEBUG=openapi-renderer:* npm start
```