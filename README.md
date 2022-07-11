# Getting Started

Before starting this service, please make sure following module is running:

1. https://github.com/zivkong/challenge-module-generate-pi

After you successfully run the Pi Generator module above, then proceed with this:

1. Clone this repo
2. Rename .env.sample to .env and fill-in mongo DB connections and PI_GENERATOR_MODULE_URI with `http://localhost:3002` if you're running locally
3. npm i
4. npm run start

## API References

| Path               | Method | Description                               | Query                   |
| ------------------ | ------ | ----------------------------------------- | ----------------------- |
| /health/check      | GET    | Health checker                            | -                       |
| /pi                | GET    | Increase and get latest Pi record         | ?increase=1 // optional |
| /circumference/sun | GET    | Get Pi value and circumference of the sun | ?increase=1 // optional |
| /pi/reset          | POST   | Clear DB Records                          | -                       |

## Reset Pi

```javascript
{
  // empty body
}
```
