# Node.js App CI/CD with Jenkins, Docker, and Docker Compose

A simple Express.js application configured for a Jenkins CI/CD pipeline.
Jenkins checks out the source from GitHub, builds a Docker image, pushes
the image to Docker Hub, and deploys the app with Docker Compose on the
Jenkins worker.

## Project overview

-   **Application:** Node.js + Express
-   **Node.js base image:** `node:20-alpine`
-   **Application port:** `3000`
-   **Container tooling:** Docker and Docker Compose
-   **CI/CD:** Jenkins Declarative Pipeline
-   **Source repository:**
    `https://github.com/neetesh-sahu/nodejs-demo-jenkins.git`
-   **Branch:** `main`
-   **Jenkins agent label:** `worker`
-   **Docker Hub image tag:** `<DOCKERHUB_USERNAME>/nodejs-app:latest`

## Repository files

  -----------------------------------------------------------------------
  File                                Purpose
  ----------------------------------- -----------------------------------
  `server.js`                         Express server and HTTP endpoints

  `package.json` /                    Node.js metadata, dependencies, and
  `package-lock.json`                 npm scripts

  `Dockerfile`                        Builds the application image using
                                      Node.js 20 Alpine

  `docker-compose.yml`                Defines the app service and
                                      publishes port `3000`

  `Jenkinsfile`                       Jenkins pipeline for checkout,
                                      image build, push, and deployment

  `eslint.config.js`                  ESLint configuration
  -----------------------------------------------------------------------

## Application endpoints

After starting the app, these endpoints are available:

  -----------------------------------------------------------------------
  Endpoint                            Description
  ----------------------------------- -----------------------------------
  `/`                                 Serves static content from
                                      `public/` if `public/index.html`
                                      exists

  `/api/hello`                        Returns a greeting; optionally pass
                                      a name,
                                      e.g. `/api/hello?name=Neetesh`

  `/api/info`                         Returns app name, Node.js version,
                                      hostname, uptime, and current
                                      server time

  `/health`                           Health check; returns
                                      `{"status":"OK"}`
  -----------------------------------------------------------------------

Example:

``` bash
curl http://localhost:3000/health
curl "http://localhost:3000/api/hello?name=Neetesh"
curl http://localhost:3000/api/info
```

## Run locally without Docker

Requirements: Node.js 18 or later and npm.

``` bash
npm ci
npm start
```

Open `http://localhost:3000`.

Available npm scripts from `package.json`:

``` bash
npm start    # Start the server
npm run dev  # Restart automatically when files change (Node.js watch mode)
npm run lint # Run ESLint
npm test     # Run Node's test runner
```

Note: the supplied `Jenkinsfile` does not currently run the lint or test
scripts.

## Build and run with Docker

Build the image:

``` bash
docker build -t nodejs-app:latest .
```

Run the container:

``` bash
docker run --name nodejs-app -d -p 3000:3000 nodejs-app:latest
```

Check it:

``` bash
docker ps
curl http://localhost:3000/health
```

Stop and remove the container:

``` bash
docker stop nodejs-app
docker rm nodejs-app
```

## Run with Docker Compose

The supplied `docker-compose.yml` builds the image from the current
directory and publishes container port `3000` to host port `3000`.

Run these commands from the directory containing `docker-compose.yml`:

``` bash
docker compose up -d --build
docker compose ps
docker compose logs -f
```

Stop the service:

``` bash
docker compose down
```

If Docker Compose says `no configuration file provided: not found`,
first move to the project directory or pass the file explicitly:

``` bash
cd /path/to/nodejs-demo-jenkins
docker compose -f docker-compose.yml up -d --build
```

## Jenkins CI/CD setup

### Prerequisites

On the Jenkins worker labelled `worker`, make sure these are available
and usable by the Jenkins agent account:

-   Git
-   Docker Engine
-   Docker Compose V2 (`docker compose version`)
-   Network access to GitHub and Docker Hub

The supplied pipeline runs on `agent { label "worker" }`, so Docker
commands and deployment run on that worker, not necessarily on the
Jenkins controller.

### Configure Docker Hub credentials

1.  In Jenkins, open **Manage Jenkins → Credentials**.
2.  Add a **Username with password** credential.
3.  Set its ID to `DockerHubCred` (this is the ID referenced by the
    supplied `Jenkinsfile`).
4.  Use your Docker Hub username and preferably a Docker Hub access
    token as the password.

Do not store credentials directly in the repository or commit them to
Git.

### Create the Jenkins job

1.  Create a **Pipeline** job in Jenkins.
2.  Configure it to use **Pipeline script from SCM**.
3.  Select **Git** and set repository URL to
    `https://github.com/neetesh-sahu/nodejs-demo-jenkins.git`.
4.  Set branch to `main` and script path to `Jenkinsfile`.
5.  Ensure the selected worker has the `worker` label and can run Docker
    commands.
6.  Run **Build Now** and review **Console Output**.

### Pipeline stages in the supplied Jenkinsfile

1.  **code** --- checks out the `main` branch from GitHub.
2.  **build** --- builds `nodejs-app:latest` from the repository's
    `Dockerfile`.
3.  **Push to dockerhub** --- logs in using Jenkins credential ID
    `DockerHubCred`, tags the image as
    `<DOCKERHUB_USERNAME>/nodejs-app:latest`, and pushes it to Docker
    Hub.
4.  **deploy** --- runs `docker compose down` and then
    `docker compose up -d`.

The deploy stage expects `docker-compose.yml` to be present in the
current Jenkins workspace. The supplied Compose file uses `build: .`, so
it builds from the workspace's Dockerfile during deployment; it does not
pull the just-pushed Docker Hub image.

## Recommended improvements

-   Use `docker login --password-stdin` rather than passing the password
    with `-p` on the command line.
-   Consider adding lint and test stages (`npm ci`, `npm run lint`, and
    `npm test`) before building the image.
-   If deployment should use the image pushed to Docker Hub, update the
    Compose service to use an image reference such as
    `<DOCKERHUB_USERNAME>/nodejs-app:latest` instead of `build: .`, and
    pull it before starting the service.
-   Add a `.dockerignore` file to avoid sending unnecessary files (such
    as `.git/` and `node_modules/`) into the Docker build context.
-   Consider adding a health check and deployment verification step
    after Compose starts.

## Troubleshooting

### `no configuration file provided: not found`

Run Compose from the folder containing `docker-compose.yml`, or use
`docker compose -f /absolute/path/docker-compose.yml ...`.

### `docker: 'buildx' is missing or broken`

BuildKit may require the Docker Buildx component. Install a Buildx
package compatible with the Docker Engine installation on the worker,
then verify with:

``` bash
docker buildx version
```

### Docker Hub login fails

Verify that the Jenkins credential ID is exactly `DockerHubCred`, the
username is correct, and the password field contains a valid Docker Hub
access token. Keep secrets masked and never print them in the Jenkins
log.

### Port 3000 is already in use

Check existing containers and processes:

``` bash
docker ps
sudo ss -ltnp | grep ':3000'
```

Stop or reconfigure the process/container that is already using port
`3000`.

------------------------------------------------------------------------

## License

The Node.js package metadata declares the project license as **MIT**.
