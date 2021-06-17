# ip-tracker

#### What would you do differently if you had more time?

* For an application that gets multiple requests from two million IPs per day, we're easily looking at more than 4,000 requests per minute. At this load, we probably want to consider horizontal scaling. With that in mind, I'd move the in-memory lists to redis so that no matter how many server instances we scale up to, all instances are using the same dataset.
* If I stay with JavaScript, I'd adopt TypeScript to avoid runtime errors.
* I'd update my tests to stop using what, after adopting TS, would become private variables.
* I'd add performance monitoring in both the test and production layer. The test layer would attempt to prevent releasing any code that causes the IPTracker class to exceed the defined performance budget. Production performance tracking would alert the dev team in real time if the same contract was breached.
* As written, `request_handled` is very fast. However, if it's not fast enough or someday becomes heavier, we could consider moving it into an asynchronous process, such as in a job queue, so that the caller need not wait for it to complete.
* Lastly, I'd question why this is useful and if there's a simpler way to get this data. The fact that we're clearing this data each morning suggests we're interested in this data in 24-hour intervals. If we're using something like Apache as our web server, it may be simpler and more reliable to add a cron that spits out the aggregated totals for us once per day.
