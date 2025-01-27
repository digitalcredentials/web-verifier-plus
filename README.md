# VerifierPlus
VerifierPlus allows users to verify any supported digital academic credential.
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Getting Started
## Installing the Server
```
$ asdf install
$ npm i --legacy-peer-deps
```
- you do not need to use `asdf` to install the dependencies, you may use another package manager of your choice. As long as the proper version(s) listed in [.tool-versions](.tool-versions) are installed this will work for you.

## Running the Server
```
$ yarn dev
```
*This creates a [dev server](http://localhost:3000) hosted at `http://localhost:3000`, open it in your browser while this is running in the command line*

### Editing the Page
Modify `pages/index.tsx`
- The page auto-updates as you edit the file.

### API Routes
[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.
- The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

# Learn More
To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

# Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# MongoDB
This app currently requires MongoDB for its backend storage. To set up MongoDB for this app:

 * create an Mongo Atlas cluster. 
 * From there create a collection, as well as a user with read and write permissions. 
 * Copy `.env.example`, and rename the copy `.env` 
 * Copy all the information from your Atlas cluster into the appropriate fields in the `.env` file.

TROUBLESHOOTING: If the app can't connect to your Mongo Atlas collection, make sure that you've added your server IP to the whitelist for your Mongo Atlas account.

 # Docker

 We've provided both a sample Dockerfile and two sample docker compose files.

 The two docker compose files are identical except that the production version includes configuration for [nginxproxy/nginx-proxy](https://github.com/nginx-proxy/nginx-proxy) and [nginxproxy/acme-companion](https://github.com/nginx-proxy/acme-companion).

 Both compose files include a HEALTHCHECK configuration that monitors the running web app container. If the healthcheck returns 'unhealthy' three times in a row, the the [willfarrell/autoheal](https://github.com/willfarrell/docker-autoheal) service restarts the container.

 You can also configure an SMTP email server, which the healtcheck will use to send emails to an email recipient whose address you can also configure. The healthcheck only sends emails if the check returns unhealthy. 
 
 And finally you can set a webhook on both the healtcheck and the autoheal, to which the same notifications of unhealthy status will be sent. We use the Slack webhook for this.

 We've set the configuation values in the 'environment' sections of the compose file, but you can also use a .env file, like the .env.example we provide. The .env file may be more secure.