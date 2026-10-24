def call(string projectName, string imageTag, string DockerHubUser)
sh "docker build -t ${DockerHubUser}/${projectName}:${imageTag} ."