# ip-tracker

#### What would you do differently if you had more time?

* I'd move the in-memory lists to redis so that no matter how many server instances we scale up to, all instances are using the same dataset.
* If I stay with JavaScript, I'd adopt TypeScript to avoid runtime errors.
* I'd update my tests to stop using what, after adopting TS, would become private variables.
* I'd add performance monitoring in both the test and production layer.
* Lastly, I'd question why this is useful and if there's a simpler way to get this data. The fact that we're clearing this data each morning suggests we're interested in this data in 24-hour intervals. If we're using something like Apache as our web server, it may be simpler to add a cron that spits out the aggregated totals for us once per day.
