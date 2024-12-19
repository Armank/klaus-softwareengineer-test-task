# How to run

## Locally

1. `npm i` - to install dependencies
2. `npm run generate-server-proto` - to generate types from .proto file
3. `npm run dev`

Server will listen on 0.0.0.0:8082

## Docker

`docker-compose up`

Server will listen on 0.0.0.0:8082

# How to query endpoints

Use Postman and import [scores.proto](./src/proto/scores.proto) file.

See Endpoints section for example payloads.

# Endpoints

1. GetAggregatedCategoryScores - Aggregated category scores over a period of time
   Example payload:
   ```json
   {
     "startDate": "2020-01-01",
     "endDate": "2020-01-30"
   }
   ```
2. GetScoresByTicket - Scores by ticket
   Example payload:

   ```json
   {
     "startDate": "2020-02-01",
     "endDate": "2020-02-05"
   }
   ```

3. GetOverallQualityScore - Overall quality score
   Example payload:

   ```json
   {
     "startDate": "2020-02-01",
     "endDate": "2020-02-05"
   }
   ```

4. GetPeriodOverPeriodChang - Period over Period score change
   Example payload:

   ```json
   {
     "selectedPeriod": {
       "startDate": "2020-02-01",
       "endDate": "2020-02-28"
     },
     "previousPeriod": {
       "startDate": "2020-01-01",
       "endDate": "2020-01-30"
     }
   }
   ```
