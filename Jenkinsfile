@Library('shared') _
pipeline {
    agent { label "worker" }

    stages {
        stage('code') {
            steps {
                script {
                    code('https://github.com/neetesh-sahu/nodejs-demo-jenkins.git', 'main')
                }
            }
        }
        stage('build'){
            steps {
               script {
                    docker_build('nodejs-app', 'latest', 'DockerHubUser')
                }
            }
        }
        stage('Push to dockerhub') {
            steps {
               script {
                    docker_push('nodejs-app', 'latest', 'DockerHubUser', 'DockerHubPass')
                }
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
