# Reproduction for an intermittent Userfront bug.

Sometimes the script runs without error.

If there is an error the script outputs the error and retries the same API request.
The first retry usually succeeds.

## To run:

```
pnpm install
pnpm start
```

## Sample output:

```
Reset Userfront
(node:1428) ExperimentalWarning: The Fetch API is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
50 users deleted.
10 tenants deleted.
Start seeding UserFront...
Created organization with id: 8b6gy9zn (Organization D)
Created workspace    with id: wn99g5rn (Organization B\Workspace 4)
Created workspace    with id: pn44wdqn (Organization B\Workspace 5)
Created organization with id: 6bgrjvjn (Organization B)
Created workspace    with id: rbvxyjxb (Organization C\Workspace 6)
Created organization with id: vbqrdw5n (Organization C)
Created workspace    with id: 5nxp6wdn (Organization A\Workspace 3)
Created workspace    with id: xbrm5wxn (Organization A\Workspace 1)
Created workspace    with id: vndgwqyb (Organization A\Workspace 2)
Created organization with id: xbppr86b (Organization A)
Created user with id: 2
Created user with id: 1
Created user with id: 3
Created user with id: 4
Created user with id: 5
Created user with id: 6
Created user with id: 22
Created user with id: 9
Created user with id: 8
Created user with id: 12
Created user with id: 13
Created user with id: 11
Created user with id: 10
Created user with id: 15
Created user with id: 16
Created user with id: 17
Created user with id: 14
Created user with id: 26
Created user with id: 20
Error: 400 (bad_request_error): Problem with request

PUT https://api.userfront.com/v0/tenants/6bgrjvjn/users/7/roles payload = {
    "roles": [
        "member"
    ]
}
    at callUserfrontApi (file:///D:/Insync/Dropbox/p/userfront-bug/node_modules/.bin/esrun-cla24np3p0000tob08po6hqpg.tmp.mjs:36:11)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async file:///D:/Insync/Dropbox/p/userfront-bug/node_modules/.bin/esrun-cla24np3p0000tob08po6hqpg.tmp.mjs:246:17
    at async Promise.all (index 3)
    at async file:///D:/Insync/Dropbox/p/userfront-bug/node_modules/.bin/esrun-cla24np3p0000tob08po6hqpg.tmp.mjs:229:9
    at async Promise.all (index 0)
    at async main (file:///D:/Insync/Dropbox/p/userfront-bug/node_modules/.bin/esrun-cla24np3p0000tob08po6hqpg.tmp.mjs:217:3)
Created user with id: 18
Created user with id: 19
Created user with id: 21
Created user with id: 28
Created user with id: 24
Created user with id: 23
Created user with id: 25
Created user with id: 33
Created user with id: 27
Created user with id: 29
Created user with id: 37
Created user with id: 31
Created user with id: 34
Created user with id: 39
Created user with id: 36
Created user with id: 35
Created user with id: 42
Created user with id: 43
Created user with id: 45
Created user with id: 41
Created user with id: 40
Created user with id: 44
Created user with id: 47
Created user with id: 32
Created user with id: 30
Created user with id: 49
Created user with id: 50
Created user with id: 46
Created user with id: 38
Created user with id: 48
Created user with id: 7
Seeding finished.
```