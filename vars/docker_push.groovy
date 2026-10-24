def call(string projectName, string imageTag, string DockerHubUser, string DockerHubPass) {
    withCredentials([usernamePassword('credentialsId': "DockerHubCred" , 
                passwordVariable:'DockerHubPass' , 
                usernameVariable: 'DockerHubUser')]){
        sh "docker login -u ${DockerHubUser} -p ${DockerHubPass}"
    }
    echo 'pushing latest image to dockerhub'
    sh "docker login -u ${DockerHubUser} -p ${DockerHubPass}"
    sh "docker image tag ${projectName}:${imageTag} ${DockerHubUser}/${projectName}:${imageTag}"
    sh "docker push ${DockerHubUser}/${projectName}:${imageTag}"
    echo 'image pushed to dockerhub'
}