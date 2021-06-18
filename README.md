# ip-tracker

### What would you do differently if you had more time?

* I'd move the in-memory lists to redis so that no matter how many server instances we scale up to, all instances are using the same dataset.
* If I stay with JavaScript, I'd adopt TypeScript to avoid runtime errors.
* I'd update my tests to stop using what, after adopting TS, would become private variables.
* I'd add performance monitoring in both the test and production layer.
* Lastly, I'd question why this is useful and if there's a simpler way to get this data. The fact that we're clearing this data each morning suggests we're interested in this data in 24-hour intervals. If we're using something like Apache as our web server, it may be simpler to add a cron that spits out the aggregated totals for us once per day.

### What is the runtime complexity of each function?

* `request_handled`: From O(1) to O(n * log(n)) where `n` is at most 100
* `top100`: O(n) where `n` is at most 100
* `clear`: O(1)

### How does your code work?

IPTracker keeps track of all ips and their occurences in a Map object and the top ips in an array.
Each time `request_handled` is called, I determine whether
* the incoming ip is already in the top ips array
* the top ips array already has 100 items in it
* the incoming ip should be in the top ips array

Based on these three booleans, I conditionally
* push an ip/count tuple into the top ips array
* sort the top ips array
* remove the 101st item from the top ips array

An important note here is that I preserve the memory address for the ip/count tuple across both the master ips Map and the top ips array.

The `top100` function, the only function to have an explicit time requirement, is as simple as mapping the top ips (a list of no more than 100 tuples) into an output array.

### What other approaches did you decide **not** to pursue?

I considered using an object instead of a Map, but a quick JSBench I created shows that in the following functionally equivalent code, object performs 76% slower than Map.

![Screen Shot 2021-06-17 at 4 36 11 PM](https://user-images.githubusercontent.com/5660076/122485553-7762b880-cf94-11eb-92fa-048892eeb581.png)

### How would you test this?

I wrote automated tests here in this repository using jest.

If this was going to production, I would like to also add tests to ensure the included functions never exceed a given performance budget.
