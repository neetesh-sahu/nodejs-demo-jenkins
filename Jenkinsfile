pipeline {
    agent { label "worker" }

    stages {
        stage('code') {
            steps {
                echo 'This is cloning the code'
                git url: 'https://github.com/neetesh-sahu/nodejs-demo-jenkins.git' , branch: 'main'
                 echo 'code cloned successful'
            }
        }
        stage('build'){
            steps {
                echo 'building the nodejs app'
                sh 'docker build -t nodejs-app:latest .'
                echo 'build successful'
            }
        }
        stage('Push to dockerhub') {
            steps {
                echo 'pushing latest image to dockerhub'
                withCredentials([usernamePassword('credentialsId': "DockerHubCred" , 
                passwordVariable:'DockerHubPass' , 
                usernameVariable: 'DockerHubUser')]){
                    sh 'docker login -u $DockerHubUser -p $DockerHubPass'
                    sh 'docker image tag nodejs-app:latest $DockerHubUser/nodejs-app:latest'
                    sh 'docker push $DockerHubUser/nodejs-app:latest'
                }
                echo 'image pushed to dockerhub'
            }
        }
        stage('deploy'){
            steps {
                echo 'deploying the node app'
                sh 'docker compose down'
                sh 'docker compose up -d --build'
                echo 'nodejs app live check on port 3000'
            }
        }
    }
}
